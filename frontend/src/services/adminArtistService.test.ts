import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "./adminArtistService";

vi.mock("axios");

const artist = {
  id: "1",
  nombre_artistico: "Söfy",
  nombre_real: "",
  origen: "Ayacucho",
  genero_musical: "Pop",
  biografia: "Bio",
  hito_relevante: "Hito",
  fuente_url: "http://example.com",
  foto_url: "",
  videos: [],
};

describe("adminArtistService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getArtists fetches the public artists list without auth", async () => {
    (axios.get as any).mockResolvedValue({ data: [artist] });

    const result = await getArtists();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/artists")
    );
    expect(result).toEqual([artist]);
  });

  it("createArtist posts to the admin endpoint with the auth header", async () => {
    (axios.post as any).mockResolvedValue({ data: artist });

    const { id, ...payload } = artist;
    const result = await createArtist("token-abc", payload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/admin/artists"),
      payload,
      { headers: { Authorization: "Bearer token-abc" } }
    );
    expect(result).toEqual(artist);
  });

  it("updateArtist puts to the correct endpoint with the auth header", async () => {
    (axios.put as any).mockResolvedValue({ data: artist });

    const { id, ...payload } = artist;
    const result = await updateArtist("token-abc", "1", payload);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/admin/artists/1"),
      payload,
      { headers: { Authorization: "Bearer token-abc" } }
    );
    expect(result).toEqual(artist);
  });

  it("deleteArtist deletes the correct endpoint with the auth header", async () => {
    (axios.delete as any).mockResolvedValue({});

    await deleteArtist("token-abc", "1");

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/admin/artists/1"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
  });
});
