from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from src.models import ContactMessage


async def create_contact_message(
    db: AsyncSession, nombre: str, email: str, mensaje: str, tipo: str
) -> ContactMessage:
    contact_message = ContactMessage(
        nombre=nombre, email=email, mensaje=mensaje, tipo=tipo
    )
    db.add(contact_message)
    await db.commit()
    await db.refresh(contact_message)
    return contact_message


async def delete_contact_message(db: AsyncSession, message_id: UUID) -> bool:
    message = await db.get(ContactMessage, message_id)
    if message is None:
        return False
    await db.delete(message)
    await db.commit()
    return True
