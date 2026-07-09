from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models import User
from src.schemas.user import UserRegisterRequest, UserLoginRequest, UserOut, UserLoginResponse
from src.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
)

router = APIRouter()


@router.post("/users/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    existing = result.scalar_one_or_none()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo.",
        )

    new_user = User(
        nombre=payload.nombre,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return UserOut(id=str(new_user.id), nombre=new_user.nombre, email=new_user.email)


@router.post("/users/login", response_model=UserLoginResponse)
async def login(payload: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
        )

    token = create_access_token(user.email)
    return UserLoginResponse(
        access_token=token, nombre=user.nombre, email=user.email
    )
