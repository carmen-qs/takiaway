async def test_register_success(client):
    response = await client.post(
        "/api/v1/users/register",
        json={"nombre": "Carmen Test", "email": "carmen.test@example.com", "password": "clave1234"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["nombre"] == "Carmen Test"
    assert body["email"] == "carmen.test@example.com"
    assert "id" in body
    assert "password" not in body
    assert "hashed_password" not in body


async def test_register_duplicate_email(client):
    payload = {"nombre": "Primero", "email": "duplicado@example.com", "password": "clave1234"}
    first = await client.post("/api/v1/users/register", json=payload)
    assert first.status_code == 201

    second = await client.post(
        "/api/v1/users/register",
        json={"nombre": "Segundo", "email": "duplicado@example.com", "password": "otraClave123"},
    )
    assert second.status_code == 409


async def test_register_invalid_email(client):
    response = await client.post(
        "/api/v1/users/register",
        json={"nombre": "Carmen", "email": "no-es-un-correo", "password": "clave1234"},
    )
    assert response.status_code == 422


async def test_register_missing_fields(client):
    response = await client.post(
        "/api/v1/users/register", json={"email": "solo-email@example.com"}
    )
    assert response.status_code == 422


async def test_login_success(client):
    await client.post(
        "/api/v1/users/register",
        json={"nombre": "Login User", "email": "login.user@example.com", "password": "clave1234"},
    )

    response = await client.post(
        "/api/v1/users/login",
        json={"email": "login.user@example.com", "password": "clave1234"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["nombre"] == "Login User"
    assert body["email"] == "login.user@example.com"


async def test_login_wrong_password(client):
    await client.post(
        "/api/v1/users/register",
        json={"nombre": "Wrong Pass", "email": "wrong.pass@example.com", "password": "claveCorrecta"},
    )

    response = await client.post(
        "/api/v1/users/login",
        json={"email": "wrong.pass@example.com", "password": "claveIncorrecta"},
    )
    assert response.status_code == 401


async def test_login_nonexistent_email(client):
    response = await client.post(
        "/api/v1/users/login",
        json={"email": "no-existe@example.com", "password": "loquesea123"},
    )
    assert response.status_code == 401
