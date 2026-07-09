from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.security import get_current_admin
from src.database import get_db
from src.models import ContactMessage
from src.schemas.contact import (
    ContactMessageCreate,
    ContactMessageOut,
    ContactMessageResponse,
)
from src.services.contact_service import create_contact_message

router = APIRouter()


@router.post(
    "/contact-messages",
    status_code=status.HTTP_201_CREATED,
    response_model=ContactMessageResponse,
)
async def post_contact_message(
    payload: ContactMessageCreate, db: AsyncSession = Depends(get_db)
):
    await create_contact_message(
        db, nombre=payload.nombre, email=payload.email, mensaje=payload.mensaje
    )
    return ContactMessageResponse(
        status="success", message="Mensaje enviado exitosamente"
    )


@router.get("/contact-messages", response_model=List[ContactMessageOut])
async def get_contact_messages(
    db: AsyncSession = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    result = await db.execute(
        select(ContactMessage).order_by(ContactMessage.fecha_creacion.desc())
    )
    return result.scalars().all()
