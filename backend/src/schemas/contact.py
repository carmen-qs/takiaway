from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

ContactMessageType = Literal["sugerencia", "reclamo", "consulta", "otro"]


class ContactMessageCreate(BaseModel):
    nombre: str = Field(min_length=1)
    email: EmailStr
    mensaje: str = Field(min_length=1)
    tipo: ContactMessageType


class ContactMessageResponse(BaseModel):
    status: str
    message: str


class ContactMessageOut(BaseModel):
    id: UUID
    nombre: str
    email: str
    mensaje: str
    tipo: str
    fecha_creacion: datetime

    model_config = {"from_attributes": True}
