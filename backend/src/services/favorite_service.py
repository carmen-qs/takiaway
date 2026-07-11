from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from src.models import Favorite, Artist


async def add_favorite(db: AsyncSession, user_id, artist_id: str) -> None:
    existing = await db.execute(
        select(Favorite).where(Favorite.user_id == user_id, Favorite.artist_id == artist_id)
    )
    if existing.scalar_one_or_none() is not None:
        return
    db.add(Favorite(user_id=user_id, artist_id=artist_id))
    await db.commit()


async def remove_favorite(db: AsyncSession, user_id, artist_id: str) -> None:
    await db.execute(
        delete(Favorite).where(Favorite.user_id == user_id, Favorite.artist_id == artist_id)
    )
    await db.commit()


async def get_user_favorite_artists(db: AsyncSession, user_id):
    stmt = (
        select(Artist)
        .join(Favorite, Favorite.artist_id == Artist.id)
        .where(Favorite.user_id == user_id)
        .options(selectinload(Artist.videos))
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_favorite_artist_ids(db: AsyncSession, user_id):
    result = await db.execute(select(Favorite.artist_id).where(Favorite.user_id == user_id))
    return [str(x) for x in result.scalars().all()]
