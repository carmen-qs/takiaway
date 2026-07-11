from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.services.artist_service import (
    get_all_artists,
    get_artist_by_id,
    get_distinct_genres,
    create_artist,
    update_artist,
    delete_artist,
)
from src.schemas.artist import ArtistCreateRequest, ArtistUpdateRequest, ArtistOut
from src.core.security import get_current_admin
from typing import Optional, List

router = APIRouter()


@router.get("/artists", response_model=List[ArtistOut])
async def list_artists(genre: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    artists = await get_all_artists(db, genre=genre)
    return artists


@router.get("/artists/{artist_id}", response_model=ArtistOut)
async def get_artist(artist_id: str, db: AsyncSession = Depends(get_db)):
    artist = await get_artist_by_id(db, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@router.get("/genres")
async def list_genres(db: AsyncSession = Depends(get_db)):
    return await get_distinct_genres(db)


@router.post("/admin/artists", status_code=201, response_model=ArtistOut)
async def admin_create_artist(
    payload: ArtistCreateRequest,
    admin_email: str = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await create_artist(db, payload)


@router.put("/admin/artists/{artist_id}", response_model=ArtistOut)
async def admin_update_artist(
    artist_id: str,
    payload: ArtistUpdateRequest,
    admin_email: str = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    artist = await update_artist(db, artist_id, payload)
    if artist is None:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@router.delete("/admin/artists/{artist_id}", status_code=204)
async def admin_delete_artist(
    artist_id: str,
    admin_email: str = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_artist(db, artist_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Artist not found")
