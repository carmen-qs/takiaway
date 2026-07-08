import uuid
from src.models import Artist
from src.services.artist_service import (
    get_all_artists,
    get_artist_by_id,
    get_distinct_genres,
)


async def test_get_all_artists_returns_list(db_session):
    artist = Artist(
        id=uuid.uuid4(),
        nombre_artistico="Test Artist Cov",
        nombre_real="Nombre Real",
        origen="Ayacucho",
        genero_musical="Genero Cobertura",
        biografia="Bio de prueba",
        hito_relevante="Hito de prueba",
        fuente_url="http://example.com",
    )
    db_session.add(artist)
    await db_session.commit()

    todos = await get_all_artists(db_session)
    assert any(a.nombre_artistico == "Test Artist Cov" for a in todos)

    filtrados = await get_all_artists(db_session, genre="Genero Cobertura")
    assert all(a.genero_musical == "Genero Cobertura" for a in filtrados)
    assert len(filtrados) >= 1


async def test_get_artist_by_id_found_and_not_found(db_session):
    artist = Artist(
        id=uuid.uuid4(),
        nombre_artistico="Otro Artista Cov",
        nombre_real=None,
        origen="Huamanga",
        genero_musical="Otro Genero",
        biografia="Bio",
        hito_relevante="Hito",
        fuente_url="http://example.com",
    )
    db_session.add(artist)
    await db_session.commit()

    encontrado = await get_artist_by_id(db_session, str(artist.id))
    assert encontrado is not None
    assert encontrado.nombre_artistico == "Otro Artista Cov"

    no_encontrado = await get_artist_by_id(db_session, str(uuid.uuid4()))
    assert no_encontrado is None


async def test_get_distinct_genres_returns_list(db_session):
    generos = await get_distinct_genres(db_session)
    assert isinstance(generos, list)
