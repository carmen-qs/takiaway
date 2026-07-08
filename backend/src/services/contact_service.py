from sqlalchemy.ext.asyncio import AsyncSession
from src.models import ContactMessage


async def create_contact_message(
    db: AsyncSession, nombre: str, email: str, mensaje: str
) -> ContactMessage:
    contact_message = ContactMessage(nombre=nombre, email=email, mensaje=mensaje)
    db.add(contact_message)
    await db.commit()
    await db.refresh(contact_message)
    return contact_message
