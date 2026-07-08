from sqlalchemy import Column, String, Text, UUID, ForeignKey
from sqlalchemy.orm import relationship, DeclarativeBase
import uuid

class Base(DeclarativeBase):
    pass

class Artist(Base):
    __tablename__ = "artists"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_artistico = Column(String, nullable=False)
    nombre_real = Column(String, nullable=True)
    origen = Column(String, nullable=False)
    genero_musical = Column(String, nullable=False)
    biografia = Column(Text, nullable=False)
    hito_relevante = Column(Text, nullable=False)
    fuente_url = Column(String, nullable=False)
    
    videos = relationship("Video", back_populates="artist")

class Video(Base):
    __tablename__ = "videos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)
    youtube_video_id = Column(String, nullable=False)
    titulo = Column(String, nullable=False)
    
    artist = relationship("Artist", back_populates="videos")
