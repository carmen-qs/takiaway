from pydantic import BaseModel, EmailStr, Field


class ContactMessageCreate(BaseModel):
    nombre: str = Field(min_length=1)
    email: EmailStr
    mensaje: str = Field(min_length=1)


class ContactMessageResponse(BaseModel):
    status: str
    message: str
