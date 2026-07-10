async def test_post_contact_message_success(client):
    payload = {
        "nombre": "Carmen Test",
        "email": "carmen@example.com",
        "mensaje": "Hola, quiero saber mas sobre TakiAway.",
        "tipo": "consulta",
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
        "tipo": "consulta",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422


async def test_post_contact_message_empty_fields(client):
    payload = {
        "nombre": "",
        "email": "carmen@example.com",
        "mensaje": "",
        "tipo": "consulta",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422


async def test_post_contact_message_invalid_tipo(client):
    payload = {
        "nombre": "Carmen Test",
        "email": "carmen@example.com",
        "mensaje": "Hola",
        "tipo": "no-existe",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422


async def test_post_contact_message_missing_tipo(client):
    payload = {
        "nombre": "Carmen Test",
        "email": "carmen@example.com",
        "mensaje": "Hola",
    }
    response = await client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 422


async def test_delete_contact_message_requires_auth(client):
    response = await client.delete(
        "/api/v1/contact-messages/00000000-0000-0000-0000-000000000000"
    )
    assert response.status_code == 401


async def test_delete_contact_message_success(client, db_session, test_admin):
    from src.services.contact_service import create_contact_message

    message = await create_contact_message(
        db_session,
        nombre="Para Borrar",
        email="borrar@example.com",
        mensaje="Este se borra",
        tipo="otro",
    )

    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test-admin@example.com", "password": "SuperSecreta123"},
    )
    token = login_response.json()["access_token"]

    response = await client.delete(
        f"/api/v1/contact-messages/{message.id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204


async def test_delete_contact_message_not_found(client, test_admin):
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test-admin@example.com", "password": "SuperSecreta123"},
    )
    token = login_response.json()["access_token"]

    response = await client.delete(
        "/api/v1/contact-messages/00000000-0000-0000-0000-000000000000",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
