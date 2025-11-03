import json
import os
import threading
from typing import List, Optional

import face_recognition
from database import SessionLocal
from face_recognition_service import (detection_logs, known_face_encodings,
                                      known_face_names, process_camera)
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from models import IO, Camera, Criminal, CriminalDetection, Station
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload

app = FastAPI(  title="Criminal Records API",
    description="API for managing criminal records with photo upload and encoding",
    version="1.0.0")
def get_db():

    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IOOut(BaseModel):
    UniqueID: int
    Name: Optional[str]
    Station: Optional[str]
    Gmail: Optional[str]
    class Config:
        orm_mode = True


class LocationEntry(BaseModel):
    message: str
    timestamp: str
class CriminalOut(BaseModel):
    UniqueID: int
    IO_ID: Optional[int]
    Name: Optional[str]
    # Exclude binary fields or encode them as base64 if needed
    photo: Optional[str]  
    Address: Optional[str]
    contact: Optional[str]
    io: Optional[IOOut]
    location_history: Optional[List[LocationEntry]] = []
    crimes: List[str] = Field(default_factory=list)

    class Config:
        orm_mode = True


threads = {}
stop_events = {}

class CameraBase(BaseModel):
    camera_location: Optional[str]
    camera_ip: Optional[str]
    StationID: Optional[int]
    
    
class CameraCreate(CameraBase):
    is_active: Optional[bool] = False
    
    
    
class CameraOut(CameraBase):
    UniqueID: int
    is_active: bool
    station_Address: Optional[str] = None
    station_email: Optional[str] = None

    class Config:
        orm_mode = True


@app.get("/cameras/")
def get_cameras(db: Session = Depends(get_db)):
    cameras = db.query(Camera).options(joinedload(Camera.station)).all()

    result = []
    for camera in cameras:
        result.append({
            "UniqueID": camera.UniqueID,
            "camera_ip": camera.camera_ip,
            "is_active": camera.is_active,
            "camera_location": camera.camera_location,
            "station_Address": camera.station.Address if camera.station else None,
            "station_email": camera.station.Gmail if camera.station else None
        })
    return result

@app.post("/cameras/", response_model=CameraOut)
def create_camera(camera: CameraCreate, db: Session = Depends(get_db)):
    db_camera = Camera(
        camera_location=camera.camera_location,
        camera_ip=camera.camera_ip,
        StationID=camera.StationID,
        is_active=False  # server decides
    )
    
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    
    return db_camera 
    
@app.delete("/cameras/{camera_id}")
def delete_camera(camera_id: int, db: Session = Depends(get_db)):
    camera = db.query(Camera).filter(Camera.UniqueID == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db.delete(camera)
    db.commit()
    return {"message": "Camera deleted successfully"}


    
@app.post("/start-cameras/")
def start_cameras(db:Session=Depends(get_db)):
    cameras = db.query(Camera).all()
    for camera in cameras:
        cam_id = camera.UniqueID
        source = camera.camera_ip
        location = camera.camera_location
        if source.isdigit():
            source = int(source)

        if cam_id in threads and threads[cam_id].is_alive():
            return {"status": "Already running"}
            continue  # already running

        stop_event = threading.Event()
        thread = threading.Thread(target=process_camera, args=(cam_id, source,location, stop_event), daemon=True)
        threads[cam_id] = thread
        camera.is_active = True
        stop_events[cam_id] = stop_event
        thread.start()
        db.add(camera)  

    # Commit all changes at once
    db.commit()        

    return {"status": "Started", "cameras": cam_id}




@app.post("/stop-cameras/")
def stop_cameras():
    stopped_cameras = []

    for cam_id, stop_event in list(stop_events.items()):
        stop_event.set()
        stopped_cameras.append(cam_id)

    for cam_id in list(threads.keys()):
        thread = threads.get(cam_id)
        if thread and thread.is_alive():
            thread.join(timeout=2)
        threads.pop(cam_id, None)
        stop_events.pop(cam_id, None)

    return {"status": "All cameras stopped", "cameras": stopped_cameras}

@app.post("/stop-camera/{cam_id}")
def stop_camera(cam_id: int,db: Session = Depends(get_db)):
    cam_id = int(cam_id)

    if cam_id not in stop_events:
        return {"error": "Camera not found or already stopped", "camera_id": cam_id}

    # Trigger stop event
    stop_events[cam_id].set()
    print(f"[DEBUG] Stop event set for camera {cam_id}")

    # Wait for thread to stop
    if cam_id in threads:
        thread = threads[cam_id]
        if thread.is_alive():
            print(f"[DEBUG] Joining thread for camera {cam_id}")
            thread.join(timeout=2)
        else:
            print(f"[DEBUG] Thread for camera {cam_id} is already stopped")

        # Remove entries
    camera = db.query(Camera).filter(Camera.UniqueID == cam_id).first()
    if camera:
        camera.is_active = False
        db.add(camera)
        db.commit()
        threads.pop(cam_id, None)
        stop_events.pop(cam_id, None)

        return {"status": "Stopped", "camera_id": cam_id}
    else:
        return {"error": "No thread found for this camera", "camera_id": cam_id}


@app.get("/logs/")
def get_logs(db:Session=Depends(get_db)):
    log = db.query(CriminalDetection).all()
    return {"logs": log}

@app.get("/criminal/",response_model=List[CriminalOut])
def get_criminal(db:Session=Depends(get_db)):
    criminals = db.query(Criminal).options(joinedload(Criminal.io)).all()
    result = []
    for c in criminals:
        try:
            location_history = json.loads(c.location_history) if c.location_history else []
        except Exception:
            location_history = []
        c_dict = c.__dict__.copy()
        c_dict['location_history'] = location_history
        c_dict['crimes']=c.crimes or []  
        result.append(c_dict)
    return result

class CriminalCreate(BaseModel):
    IO_ID: Optional[int]
    Name: Optional[str]
    photo: Optional[str]
    Address: Optional[str]
    contact: Optional[str]
    crimes: List[str] = Field(default_factory=list)

    class Config:
        orm_mode = True


@app.get("/image/{unique_id}")
def get_image(unique_id: int):
    db: Session = SessionLocal()
    person = db.query(Criminal).filter(Criminal.UniqueID == unique_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    if not person.photo:
        raise HTTPException(status_code=404, detail="Image path not found")

    file_path = person.photo


    return FileResponse(file_path)


@app.get("/io/")
def get_io(db:Session=Depends(get_db)):
    return db.query(IO).all()

@app.get("/station")
def get_station(db:Session=Depends(get_db)):
    return db.query(Station).all()


class IOCreate(BaseModel):
    Name: str
    Station: str
    Gmail: str
    contact_number:str


@app.post("/io/")
def create_io(io: IOCreate, db: Session = Depends(get_db)):
    new_io = IO(
        Name=io.Name,
        Station=io.Station,
        Gmail=io.Gmail,
        contact_number=io.contact_number,
    )
    db.add(new_io)
    db.commit()
    db.refresh(new_io)
    return {"message": "IO created successfully", "data": new_io}

@app.delete("/io/{io_id}")
def delete_io(io_id: int, db: Session = Depends(get_db)):
    io = db.query(IO).filter(IO.UniqueID == io_id).first()

    if not io:
        raise HTTPException(status_code=404, detail="IO not found")

    db.delete(io)
    db.commit()
    return {"message": "IO deleted successfully"}



UPLOAD_DIR = "uploads"
known_face_encodings = []
known_face_names = []

@app.post("/register-criminal/")
async def register_face(photo: UploadFile = File(...),    db: Session = Depends(get_db)
):
    global known_face_encodings, known_face_names
    filename = photo.filename.lower()

    if not (filename.endswith(".jpg") or filename.endswith(".png")):
        return {"error": "Only .jpg and .png files are supported."}

    file_path = os.path.join(UPLOAD_DIR, photo.filename)
    
    contents = await photo.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    image = face_recognition.load_image_file(file_path)
    encodings = face_recognition.face_encodings(image)

    if not encodings:
        return {"error": "No face detected in the image."}

    # Convert NumPy array to list -> JSON string (to store in LONGTEXT)
    encoding_list = encodings[0].tolist()
    encoding_str = json.dumps(encoding_list)  # ← store this in your DB LONGTEXT field
    
        
    # For demonstration: return current full lists converted to serializable types
    return {
        "message": "Face registered successfully.",
        "encodings": encoding_str,
        "names": known_face_names
    }

@app.post("/criminal/")
async def register_criminal(
    IO_ID: int = Form(...),
    Name: str = Form(...),
    Address: str = Form(...),
    contact: str = Form(...),
    crimes: str = Form(...),  # Accepts JSON string, e.g., '["Robbery", "Fraud"]'
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = photo.filename.lower()
    if not (filename.endswith(".jpg") or filename.endswith(".png")):
        return {"error": "Only .jpg and .png files are supported."}

    # Save image to disk
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, photo.filename)
    contents = await photo.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Face encoding
    image = face_recognition.load_image_file(file_path)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return {"error": "No face detected in the image."}

    # Convert encoding to JSON string
    encoding_str = json.dumps(encodings[0].tolist())

    # Convert crimes to Python list if it's passed as a JSON string
    try:
        crimes_list = json.loads(crimes)
        if not isinstance(crimes_list, list):
            raise ValueError
    except (json.JSONDecodeError, ValueError):
        crimes_list = [crime.strip() for crime in crimes.split(',') if crime.strip()]


    # Save to DB
    db_criminal = Criminal(
        IO_ID=IO_ID,
        Name=Name,
        Address=Address,
        contact=contact,
        crimes=crimes_list,
        photo=file_path, 
        Encodeimage=encoding_str
    )
    db.add(db_criminal)
    db.commit()
    db.refresh(db_criminal)

    return {
        "message": "Criminal registered successfully.",
        "criminal": {
            "UniqueID": db_criminal.UniqueID,
            "Name": db_criminal.Name,
            "photo": db_criminal.photo,
            "crimes": db_criminal.crimes
        }
    }
    
    

@app.delete("/criminal/{criminal_id}")
def delete_criminal(criminal_id: int, db: Session = Depends(get_db)):
    db_criminal = db.query(Criminal).filter(Criminal.UniqueID == criminal_id).first()
    if not db_criminal:
        raise HTTPException(status_code=404, detail="Criminal not found")
        
    db.query(CriminalDetection).filter(CriminalDetection.CriminalID == criminal_id).delete()

    db.delete(db_criminal)
    db.commit()
    return {"message": f"Criminal with ID {criminal_id} has been deleted."}



class CriminalUpdate(BaseModel):
    IO_ID: Optional[int]
    Name: Optional[str]
    Address: Optional[str]
    contact: Optional[str]
    crimes: List[str] = Field(default_factory=list)
        
@app.put("/criminal/{criminal_id}")
def update_criminal(criminal_id: int, criminal_data: CriminalUpdate, db: Session = Depends(get_db)):
    db_criminal = db.query(Criminal).filter(Criminal.UniqueID == criminal_id).first()
    if not db_criminal:
        raise HTTPException(status_code=404, detail="Criminal not found")
    for field, value in criminal_data.dict(exclude_unset=True).items():
        setattr(db_criminal, field, value)

    # db_criminal.Name = criminal.Name
    # db_criminal.Address = criminal.Address
    # db_criminal.contact = criminal.contact
    # db_criminal.crimes = criminal.crimes

    db.commit()
    db.refresh(db_criminal)

    return {"message": f"Criminal with ID {criminal_id} has been updated."}


