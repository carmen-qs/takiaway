from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from src.models import Artist

async def get_all_artists(db: AsyncSession, genre: str = None):
    stmt = select(Artist)
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
