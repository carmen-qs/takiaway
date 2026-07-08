from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.schemas.contact import ContactMessageCreate, ContactMessageResponse
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
