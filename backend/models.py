from sqlalchemy import Boolean,Column, Integer, String, Text, LargeBinary,ForeignKey,DateTime
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from sqlalchemy.ext.mutable import MutableList
from database import Base, engine



class Criminal(Base):
    __tablename__ = "criminal"

   
    UniqueID = Column(Integer, primary_key=True, autoincrement=True)
    IO_ID = Column(Integer,ForeignKey("io.UniqueID"), index=True, nullable=True)
    Name = Column(String(100), nullable=True)
    photo = Column(String(255), nullable=True)  
    Encodeimage = Column(Text, nullable=True)   # longtext
    Address = Column(Text, nullable=True)
    contact = Column(String(20), nullable=True)
    io = relationship("IO", back_populates="criminals")
    location_history = Column(JSON, default=[])  # store array of locations
    crimes = Column(MutableList.as_mutable(JSON), default=list, nullable=True)

class CriminalDetection(Base):
    __tablename__ = "criminaldetections"

    ID = Column(Integer, primary_key=True, index=True,autoincrement=True)
    CriminalID = Column(Integer, ForeignKey("criminal.UniqueID"))  # Adjust if your table name is different
    CameraID = Column(Integer,ForeignKey("camera.UniqueID"))
    DateTime = Column(DateTime)
    FullTexts = Column(String(255))
    # criminal = relationship("Criminal", back_populates="criminaldetections")  #

class IO(Base):
    __tablename__ = "io"

    UniqueID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(100), nullable=True)
    contact_number = Column(String(20), nullable=True)
    Gmail = Column(String(100), nullable=True)
    Station = Column(String(100), nullable=True)
    criminals = relationship("Criminal", back_populates="io")

class Camera(Base):
    __tablename__ = "camera"

    UniqueID = Column(Integer, primary_key=True, index=True)
    camera_location = Column(String(100), nullable=True)
    camera_ip = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=True,default=False)
    StationID = Column(Integer, ForeignKey("station.UniqueID"), nullable=True)
    station = relationship("Station", back_populates="cameras")


class Station(Base):
    __tablename__ = "station"

    UniqueID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(100), nullable=False)
    Address = Column(Text, nullable=True)
    contact_number = Column(String(20), nullable=True)
    Gmail = Column(String(100), nullable=True)

    cameras = relationship("Camera", back_populates="station")


Base.metadata.create_all(bind=engine)
print("✅ All tables created in eagleeye database!")