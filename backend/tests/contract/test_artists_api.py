async def test_list_artists_returns_200(client):
    response = await client.get("/api/v1/artists")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_artist_not_found_returns_404(client):
    response = await client.get(
        "/api/v1/artists/00000000-0000-0000-0000-000000000000"
    )
    assert response.status_code == 404


async def test_list_genres_returns_200(client):
    response = await client.get("/api/v1/genres")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
