from sqlalchemy import select
from src.models import ContactMessage


async def test_contact_message_is_persisted(client, db_session):
    payload = {
        "nombre": "Integracion Test",
        "email": "integracion@example.com",
        "mensaje": "Mensaje de prueba de integracion.",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 201

    result = await db_session.execute(
        select(ContactMessage).where(
            ContactMessage.email == "integracion@example.com"
        )
    )
    saved = result.scalars().first()
    assert saved is not None
    assert saved.nombre == "Integracion Test"
    assert saved.mensaje == "Mensaje de prueba de integracion."
