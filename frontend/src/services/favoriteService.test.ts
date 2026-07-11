import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getFavoriteIds,
  getFavoriteArtists,
  addFavorite,
  removeFavorite,
} from "./favoriteService";

vi.mock("axios");

describe("favoriteService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getFavoriteIds sends the auth header and returns the ids", async () => {
    (axios.get as any).mockResolvedValue({ data: ["1", "2"] });

    const result = await getFavoriteIds("token-abc");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/favorites/ids"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
    expect(result).toEqual(["1", "2"]);
  });

  it("getFavoriteArtists sends the auth header and returns artist data", async () => {
    const data = [{ id: "1", nombre_artistico: "Söfy", origen: "Ayacucho", genero_musical: "Pop" }];
    (axios.get as any).mockResolvedValue({ data });

    const result = await getFavoriteArtists("token-abc");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/favorites"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
    expect(result).toEqual(data);
  });

  it("addFavorite posts to the correct endpoint with the auth header", async () => {
    (axios.post as any).mockResolvedValue({});

    await addFavorite("token-abc", "artist-1");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/favorites/artist-1"),
      null,
      { headers: { Authorization: "Bearer token-abc" } }
    );
  });

  it("removeFavorite deletes the correct endpoint with the auth header", async () => {
    (axios.delete as any).mockResolvedValue({});

    await removeFavorite("token-abc", "artist-1");

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/favorites/artist-1"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
  });
});
