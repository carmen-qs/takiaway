from src.schemas.artist import ArtistCreateRequest, ArtistUpdateRequest, VideoIn
from src.services.artist_service import (
    create_artist,
    update_artist,
    delete_artist,
    get_artist_by_id,
)


def _payload(**overrides) -> ArtistCreateRequest:
    base = dict(
        nombre_artistico="Artista CRUD Test",
        nombre_real="Nombre Real",
        origen="Ayacucho",
        genero_musical="Genero Test",
        biografia="Bio de prueba",
        hito_relevante="Hito de prueba",
        fuente_url="http://example.com",
        foto_url=None,
        videos=[VideoIn(youtube_video_id="abc123", titulo="Video Test")],
    )
    base.update(overrides)
    return ArtistCreateRequest(**base)


async def test_create_artist_persists_with_videos(db_session):
    artist = await create_artist(db_session, _payload())

    assert artist.nombre_artistico == "Artista CRUD Test"
    assert len(artist.videos) == 1
    assert artist.videos[0].titulo == "Video Test"


async def test_update_artist_replaces_fields_and_videos(db_session):
    created = await create_artist(db_session, _payload())

    update_payload = ArtistUpdateRequest(
        nombre_artistico="Nombre Actualizado",
        nombre_real=None,
        origen="Huamanga",
        genero_musical="Nuevo Genero",
        biografia="Bio actualizada",
        hito_relevante="Hito actualizado",
        fuente_url="http://example.com/actualizado",
        foto_url="http://example.com/foto.jpg",
        videos=[VideoIn(youtube_video_id="xyz789", titulo="Video Nuevo")],
    )

    updated = await update_artist(db_session, str(created.id), update_payload)

    assert updated.nombre_artistico == "Nombre Actualizado"
    assert updated.genero_musical == "Nuevo Genero"
    assert len(updated.videos) == 1
    assert updated.videos[0].titulo == "Video Nuevo"


async def test_update_artist_not_found_returns_none(db_session):
    fake_id = "00000000-0000-0000-0000-000000000000"
    update_payload = ArtistUpdateRequest(
        nombre_artistico="No Importa",
        nombre_real=None,
        origen="No Importa",
        genero_musical="No Importa",
        biografia="No Importa",
        hito_relevante="No Importa",
        fuente_url="http://example.com",
        foto_url=None,
        videos=[],
    )

    result = await update_artist(db_session, fake_id, update_payload)
    assert result is None


async def test_delete_artist_removes_it_and_its_videos(db_session):
    created = await create_artist(db_session, _payload())

    deleted = await delete_artist(db_session, str(created.id))
    assert deleted is True

    found = await get_artist_by_id(db_session, str(created.id))
    assert found is None


async def test_delete_artist_not_found_returns_false(db_session):
    fake_id = "00000000-0000-0000-0000-000000000000"
    deleted = await delete_artist(db_session, fake_id)
    assert deleted is False
