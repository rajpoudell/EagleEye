import cv2
import face_recognition
import os
import numpy as np
from datetime import datetime, timedelta
import threading
import json

from database import SessionLocal
from models import Criminal  # Adjust this import based on your project structure
from models import CriminalDetection,Camera
# === Fetch known faces from the database ===
import json
import numpy as np
from utils.email import send_email_alert

def fetch_known_faces():
    session = SessionLocal()
    known_encodings = []
    known_names = []

    try:
        criminals = session.query(Criminal).all()

        for criminal in criminals:
            try:
                if not criminal.Encodeimage:
                    print(f"[Warning] No encoding for {criminal.Name}")
                    continue

                # Parse the JSON string from longtext field
                encoding_list = json.loads(criminal.Encodeimage)

                # Convert to numpy array
                encoding_array = np.array(encoding_list)

                if encoding_array.size == 0:
                    print(f"[Warning] Empty encoding for {criminal.Name}")
                    continue

                known_encodings.append(encoding_array)
                known_names.append({
                    "name": criminal.Name,
                    "id": criminal.UniqueID
                })

                print(f"[Database] Loaded: {criminal.Name}")
            except Exception as e:
                print(f"[Error] Failed to process {criminal.Name}: {e}")
    finally:
        session.close()

    return known_encodings, known_names

# === Load known faces ===
print("Loading known faces from database...")
known_face_encodings, known_face_names = fetch_known_faces()
detection_logs = []
last_detection_times = {}
cooldown_minutes = 1



if not known_face_encodings:
    print("[Warning] No known faces loaded.")
    # Avoid `exit()` to keep API running

# === Face Detection Function ===
def process_camera(camera_id, source,location, stop_event):
    print(f"[Camera {camera_id}] Starting...")
    video_capture = cv2.VideoCapture(source)

    if not video_capture.isOpened():
        log = f"[Camera {camera_id}] Error: Could not open camera."
        print(log)
        detection_logs.append(log)
        return

    video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    frame_counter = 0
    process_every_n_frame = 5

    while not stop_event.is_set():
        ret, frame = video_capture.read()
        if not ret:
            log = f"[Camera {camera_id}] Camera disconnected or feed ended."
            print(log)
            detection_logs.append(log)
            break   

        frame = cv2.flip(frame, 1)
        frame_counter += 1

        if frame_counter % process_every_n_frame != 0:
            cv2.imshow(f'Camera {camera_id}', frame)
            if cv2.waitKey(1) == 27:
                break
            continue

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        small_frame = cv2.resize(rgb_frame, (0, 0), fx=0.5, fy=0.5)
        face_locations = face_recognition.face_locations(small_frame, model="hog")
        face_locations = [(top*2, right*2, bottom*2, left*2) for (top, right, bottom, left) in face_locations]

        if not face_locations:
            cv2.imshow(f'Camera {camera_id}', frame)
            if cv2.waitKey(1) == 27:
                break
            continue

        try:
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        except Exception as e:
            print(f"[Camera {camera_id}] Encoding error: {e}")
            continue

        current_time = datetime.now()

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            criminal_id = None

            if True in matches and known_face_names and len(known_face_names) == len(known_face_encodings):
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if best_match_index < len(known_face_names):
                    matched_info = known_face_names[best_match_index]
                    name = matched_info["name"]
                    criminal_id = matched_info.get("id")

                    # Handle cooldown
                    last_time = last_detection_times.get((name, camera_id))
                    if last_time and (datetime.now() - last_time < timedelta(minutes=cooldown_minutes)):
                        continue
                    
                    # Log detection
                    detection_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    log_message = f"[Camera {camera_id}] Detected {name} at {detection_time} at location:{location}"
                    detection_logs.append(log_message)
                    print(log_message)
                    last_detection_times[(name, camera_id)] = datetime.now()
                    
                    # Save to DB
                    session = SessionLocal()
                    try:
                        new_log = CriminalDetection(
                            CriminalID=criminal_id,
                            CameraID=camera_id,
                            DateTime=datetime.now(),
                            FullTexts=log_message
                        )
                        camera = session.query(Camera).filter(Camera.UniqueID == camera_id).first()
                        if camera:
                            camera.is_active = True
                        criminal = session.query(Criminal).filter(Criminal.UniqueID == criminal_id).first()
                        
                        if criminal.io and hasattr(criminal.io, 'Gmail'):
                            recipient_email = criminal.io.Gmail
                            email_subject = f"Alert: {name} detected on Camera {location}"
                            email_body = f"Criminal {name} was detected at {detection_time} on camera {camera_id} at location: {location}. Image: http://127.0.0.1:8000/image/{criminal.UniqueID}"
                            send_email_alert(
                                to_email=recipient_email,
                                subject=email_subject,
                                body=email_body
                            )

                    
                      
                        current_history = json.loads(criminal.location_history or "[]")
                        current_history.append({
                                "message": log_message,
                                "timestamp": datetime.now().isoformat()
                            })
                        criminal.location_history = json.dumps(current_history)
                        session.add(new_log)

                        session.commit()
                    except Exception as e:
                        try:
                            with SessionLocal() as db:
                                camera = db.query(Camera).filter(Camera.UniqueID == camera_id).first()
                                if camera:
                                    camera.is_active = False
                                    db.commit()
                        except Exception as db_err:
                            print(f"[Camera {camera_id}] DB error while updating status: {db_err}")
                        print(f"[Camera {camera_id}] Processing error: {e}")
                        print(f"[Email] Error sending alert: {e}")

            # Draw on frame
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, name, (left + 6, bottom - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        cv2.imshow(f'Camera {camera_id}', frame)
        if cv2.waitKey(1) == 27:
            break

    video_capture.release()
    cv2.destroyWindow(f'Camera {camera_id}')
    print(f"[Camera {camera_id}] Stopped.")
