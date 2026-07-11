from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from src.models import Artist, Video


async def get_all_artists(db: AsyncSession, genre: str = None):
    stmt = select(Artist).options(selectinload(Artist.videos))
    if genre:
        stmt = stmt.where(Artist.genero_musical == genre)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_artist_by_id(db: AsyncSession, artist_id: str):
    result = await db.execute(
        select(Artist).where(Artist.id == artist_id).options(selectinload(Artist.videos))
    )
    return result.scalar_one_or_none()


async def get_distinct_genres(db: AsyncSession):
    result = await db.execute(select(Artist.genero_musical).distinct())
    return result.scalars().all()


async def create_artist(db: AsyncSession, payload) -> Artist:
    artist = Artist(
        nombre_artistico=payload.nombre_artistico,
        nombre_real=payload.nombre_real,
        origen=payload.origen,
        genero_musical=payload.genero_musical,
        biografia=payload.biografia,
        hito_relevante=payload.hito_relevante,
        fuente_url=payload.fuente_url,
        foto_url=payload.foto_url,
        videos=[Video(youtube_video_id=v.youtube_video_id, titulo=v.titulo) for v in payload.videos],
    )
    db.add(artist)
    await db.commit()
    return await get_artist_by_id(db, str(artist.id))


async def update_artist(db: AsyncSession, artist_id: str, payload):
    artist = await get_artist_by_id(db, artist_id)
    if artist is None:
        return None

    artist.nombre_artistico = payload.nombre_artistico
    artist.nombre_real = payload.nombre_real
    artist.origen = payload.origen
    artist.genero_musical = payload.genero_musical
    artist.biografia = payload.biografia
    artist.hito_relevante = payload.hito_relevante
    artist.fuente_url = payload.fuente_url
    artist.foto_url = payload.foto_url

    for old_video in list(artist.videos):
        await db.delete(old_video)
    artist.videos = [Video(youtube_video_id=v.youtube_video_id, titulo=v.titulo) for v in payload.videos]

    await db.commit()
    return await get_artist_by_id(db, artist_id)


async def delete_artist(db: AsyncSession, artist_id: str) -> bool:
    artist = await get_artist_by_id(db, artist_id)
    if artist is None:
        return False
    for video in list(artist.videos):
        await db.delete(video)
    await db.delete(artist)
    await db.commit()
    return True
