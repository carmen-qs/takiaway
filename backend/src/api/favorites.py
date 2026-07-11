from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.database import get_db
from src.core.security import get_current_user
from src.models import User, Artist
from src.services.favorite_service import (
    add_favorite,
    remove_favorite,
    get_user_favorite_artists,
    get_favorite_artist_ids,
)

router = APIRouter()


@router.get("/favorites")
async def list_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_user_favorite_artists(db, current_user.id)


@router.get("/favorites/ids")
async def list_favorite_ids(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_favorite_artist_ids(db, current_user.id)


@router.post("/favorites/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def create_favorite(
    artist_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Artist).where(Artist.id == artist_id))
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Artist not found")
    await add_favorite(db, current_user.id, artist_id)


@router.delete("/favorites/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(
    artist_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await remove_favorite(db, current_user.id, artist_id)
