import uuid
from src.models import Artist, User
from src.services.auth_service import get_password_hash
from src.services.favorite_service import (
    add_favorite,
    remove_favorite,
    get_user_favorite_artists,
    get_favorite_artist_ids,
)


async def _create_user(db_session) -> User:
    user = User(
        nombre="Fan Service Test",
        email=f"fan.service.{uuid.uuid4()}@example.com",
        hashed_password=get_password_hash("clave1234"),
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


async def _create_artist(db_session) -> Artist:
    artist = Artist(
        nombre_artistico="Artista Service Test",
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
    return artist


async def test_add_favorite_creates_relation(db_session):
    user = await _create_user(db_session)
    artist = await _create_artist(db_session)

    await add_favorite(db_session, user.id, str(artist.id))

    ids = await get_favorite_artist_ids(db_session, user.id)
    assert str(artist.id) in ids


async def test_add_favorite_twice_is_idempotent(db_session):
    user = await _create_user(db_session)
    artist = await _create_artist(db_session)

    await add_favorite(db_session, user.id, str(artist.id))
    await add_favorite(db_session, user.id, str(artist.id))

    favorites = await get_user_favorite_artists(db_session, user.id)
    assert len(favorites) == 1


async def test_remove_favorite_deletes_relation(db_session):
    user = await _create_user(db_session)
    artist = await _create_artist(db_session)

    await add_favorite(db_session, user.id, str(artist.id))
    await remove_favorite(db_session, user.id, str(artist.id))

    ids = await get_favorite_artist_ids(db_session, user.id)
    assert str(artist.id) not in ids


async def test_remove_favorite_never_added_does_not_error(db_session):
    user = await _create_user(db_session)
    artist = await _create_artist(db_session)

    await remove_favorite(db_session, user.id, str(artist.id))

    ids = await get_favorite_artist_ids(db_session, user.id)
    assert ids == []


async def test_get_user_favorite_artists_returns_artist_objects(db_session):
    user = await _create_user(db_session)
    artist = await _create_artist(db_session)

    await add_favorite(db_session, user.id, str(artist.id))

    favorites = await get_user_favorite_artists(db_session, user.id)
    assert len(favorites) == 1
    assert favorites[0].nombre_artistico == "Artista Service Test"
