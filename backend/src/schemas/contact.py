from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    nombre: str = Field(min_length=1)
    email: EmailStr
    mensaje: str = Field(min_length=1)


class ContactMessageResponse(BaseModel):
    status: str
    message: str


class ContactMessageOut(BaseModel):
    id: UUID
    nombre: str
    email: str
    mensaje: str
    fecha_creacion: datetime

    model_config = {"from_attributes": True}
