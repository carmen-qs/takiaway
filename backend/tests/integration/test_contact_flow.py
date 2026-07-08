from sqlalchemy import select, delete
from src.database import AsyncSessionLocal
from src.models import ContactMessage


async def test_contact_message_is_persisted(client):
    test_email = "integracion@example.com"

    async with AsyncSessionLocal() as session:
        await session.execute(
            delete(ContactMessage).where(ContactMessage.email == test_email)
        )
        await session.commit()

    payload = {
        "nombre": "Integracion Test",
        "email": test_email,
        "mensaje": "Mensaje de prueba de integracion.",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 201

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ContactMessage).where(ContactMessage.email == test_email)
        )
        saved = result.scalars().first()
        assert saved is not None
        assert saved.nombre == "Integracion Test"
        assert saved.mensaje == "Mensaje de prueba de integracion."

        # Cleanup para no dejar residuo para la siguiente corrida
        await session.execute(
            delete(ContactMessage).where(ContactMessage.email == test_email)
        )
        await session.commit()
