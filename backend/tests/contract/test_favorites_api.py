from src.models import Artist


async def _create_artist(db_session) -> str:
    artist = Artist(
        nombre_artistico="Artista Favoritos Test",
        nombre_real=None,
        origen="Ayacucho",
        genero_musical="Genero Test",
        biografia="Bio",
        hito_relevante="Hito",
        fuente_url="http://example.com",
    )
    db_session.add(artist)
    await db_session.commit()
    await db_session.refresh(artist)
    return str(artist.id)


async def _register_and_login(client, email: str) -> str:
    await client.post(
        "/api/v1/users/register",
        json={"nombre": "Fan Test", "email": email, "password": "clave1234"},
    )
    login = await client.post(
        "/api/v1/users/login", json={"email": email, "password": "clave1234"}
    )
    return login.json()["access_token"]


def _auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


async def test_add_and_list_favorite(client, db_session):
    artist_id = await _create_artist(db_session)
    token = await _register_and_login(client, "fan.favorites@example.com")

    add_response = await client.post(
        f"/api/v1/favorites/{artist_id}", headers=_auth_header(token)
    )
    assert add_response.status_code == 204

    list_response = await client.get(
        "/api/v1/favorites", headers=_auth_header(token)
    )
    assert list_response.status_code == 200
    names = [a["nombre_artistico"] for a in list_response.json()]
    assert "Artista Favoritos Test" in names

    ids_response = await client.get(
        "/api/v1/favorites/ids", headers=_auth_header(token)
    )
    assert artist_id in ids_response.json()


async def test_add_favorite_nonexistent_artist(client):
    token = await _register_and_login(client, "fan.404@example.com")

    response = await client.post(
        "/api/v1/favorites/00000000-0000-0000-0000-000000000000",
        headers=_auth_header(token),
    )
    assert response.status_code == 404


async def test_add_favorite_is_idempotent(client, db_session):
    artist_id = await _create_artist(db_session)
    token = await _register_and_login(client, "fan.duplicate@example.com")

    first = await client.post(
        f"/api/v1/favorites/{artist_id}", headers=_auth_header(token)
    )
    second = await client.post(
        f"/api/v1/favorites/{artist_id}", headers=_auth_header(token)
    )
    assert first.status_code == 204
    assert second.status_code == 204

    list_response = await client.get(
        "/api/v1/favorites", headers=_auth_header(token)
    )
    assert len(list_response.json()) == 1


async def test_remove_favorite(client, db_session):
    artist_id = await _create_artist(db_session)
    token = await _register_and_login(client, "fan.remove@example.com")

    await client.post(f"/api/v1/favorites/{artist_id}", headers=_auth_header(token))

    delete_response = await client.delete(
        f"/api/v1/favorites/{artist_id}", headers=_auth_header(token)
    )
    assert delete_response.status_code == 204

    list_response = await client.get(
        "/api/v1/favorites", headers=_auth_header(token)
    )
    assert list_response.json() == []


async def test_remove_favorite_that_was_never_added(client, db_session):
    artist_id = await _create_artist(db_session)
    token = await _register_and_login(client, "fan.remove.none@example.com")

    response = await client.delete(
        f"/api/v1/favorites/{artist_id}", headers=_auth_header(token)
    )
    assert response.status_code == 204


async def test_favorites_endpoints_require_auth(client, db_session):
    artist_id = await _create_artist(db_session)

    assert (await client.get("/api/v1/favorites")).status_code == 401
    assert (await client.get("/api/v1/favorites/ids")).status_code == 401
    assert (
        await client.post(f"/api/v1/favorites/{artist_id}")
    ).status_code == 401
    assert (
        await client.delete(f"/api/v1/favorites/{artist_id}")
    ).status_code == 401


async def test_favorites_with_malformed_token(client):
    response = await client.get(
        "/api/v1/favorites", headers=_auth_header("token-invalido")
    )
    assert response.status_code == 401
