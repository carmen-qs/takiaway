import pytest
from src.models import AdminUser
from src.services.auth_service import get_password_hash


@pytest.fixture
async def test_admin(db_session):
    """Crea un admin de prueba dentro de la transaccion aislada del test.
    Se revierte automaticamente al terminar (ver conftest.py)."""
    admin = AdminUser(
        email="test-admin@example.com",
        hashed_password=get_password_hash("SuperSecreta123"),
    )
    db_session.add(admin)
    await db_session.commit()
    return admin


async def test_login_success(client, test_admin):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test-admin@example.com", "password": "SuperSecreta123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


async def test_login_wrong_password(client, test_admin):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test-admin@example.com", "password": "ContraseñaIncorrecta"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


async def test_login_nonexistent_email(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "no-existe@example.com", "password": "loquesea123"},
    )
    assert response.status_code == 401


async def test_login_missing_fields(client):
    response = await client.post("/api/v1/auth/login", json={"email": "solo-email@example.com"})
    assert response.status_code == 422


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def test_get_messages_with_valid_token(client, test_admin):
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test-admin@example.com", "password": "SuperSecreta123"},
    )
    token = login_response.json()["access_token"]

    response = await client.get(
        "/api/v1/contact-messages", headers=_auth_header(token)
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_messages_without_token(client):
    response = await client.get("/api/v1/contact-messages")
    assert response.status_code == 401


async def test_get_messages_with_malformed_token(client):
    response = await client.get(
        "/api/v1/contact-messages", headers=_auth_header("not-a-real-token")
    )
    assert response.status_code == 401
