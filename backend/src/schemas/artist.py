from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List


class VideoIn(BaseModel):
    youtube_video_id: str
    titulo: str


class ArtistCreateRequest(BaseModel):
    nombre_artistico: str
    nombre_real: Optional[str] = None
    origen: str
    genero_musical: str
    biografia: str
    hito_relevante: str
    fuente_url: str
    foto_url: Optional[str] = None
    videos: List[VideoIn] = []


class ArtistUpdateRequest(ArtistCreateRequest):
    pass


class VideoOut(BaseModel):
    id: UUID
    youtube_video_id: str
    titulo: str

    class Config:
        from_attributes = True


class ArtistOut(BaseModel):
    id: UUID
    nombre_artistico: str
    nombre_real: Optional[str] = None
    origen: str
    genero_musical: str
    biografia: str
    hito_relevante: str
    fuente_url: str
    foto_url: Optional[str] = None
    videos: List[VideoOut] = []

    class Config:
        from_attributes = True
