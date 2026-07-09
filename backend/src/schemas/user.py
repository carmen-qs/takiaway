from pydantic import BaseModel, EmailStr


class UserRegisterRequest(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    nombre: str
    email: str

    model_config = {"from_attributes": True}


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nombre: str
    email: str
