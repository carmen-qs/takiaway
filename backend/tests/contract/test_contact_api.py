async def test_post_contact_message_success(client):
    payload = {
        "nombre": "Carmen Test",
        "email": "carmen@example.com",
        "mensaje": "Hola, quiero saber mas sobre TakiAway.",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "success"
    assert "message" in body


async def test_post_contact_message_invalid_email(client):
    payload = {
        "nombre": "Carmen Test",
        "email": "not-an-email",
        "mensaje": "Hola",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422


async def test_post_contact_message_empty_fields(client):
    payload = {"nombre": "", "email": "carmen@example.com", "mensaje": ""}
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422
