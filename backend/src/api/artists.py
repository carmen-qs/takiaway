from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.services.artist_service import get_all_artists, get_artist_by_id, get_distinct_genres
from typing import Optional

router = APIRouter()

@router.get("/artists")
async def list_artists(genre: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    artists = await get_all_artists(db, genre=genre)
    return artists

@router.get("/artists/{artist_id}")
async def get_artist(artist_id: str, db: AsyncSession = Depends(get_db)):
    artist = await get_artist_by_id(db, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist

@router.get("/genres")
async def list_genres(db: AsyncSession = Depends(get_db)):
    return await get_distinct_genres(db)
