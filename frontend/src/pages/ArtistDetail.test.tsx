import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import ArtistDetail from "./ArtistDetail";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = axios.get as unknown as ReturnType<typeof vi.fn>;

function renderWithRoute(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/artist/${id}`]}>
      <Routes>
        <Route path="/artist/:id" element={<ArtistDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ArtistDetail page", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("shows a loading state initially", () => {
    mockedGet.mockImplementation(() => new Promise(() => {}));
    renderWithRoute("1");
    expect(
      screen.getByText(/cargando perfil del artista/i)
    ).toBeInTheDocument();
  });

  it("renders the artist profile once loaded", async () => {
    mockedGet.mockResolvedValue({
      data: {
        id: "1",
        nombre_artistico: "Renata Flores Rivera",
        nombre_real: "Renata Flores",
        origen: "Huamanga, Ayacucho",
        genero_musical: "Trap y pop andino en quechua",
        biografia: "Biografía de prueba.",
        hito_relevante: "Hito de prueba.",
        videos: [{ youtube_video_id: "abc123", titulo: "Video de prueba" }],
      },
    });

    renderWithRoute("1");

    expect(
      await screen.findByText("Renata Flores Rivera")
    ).toBeInTheDocument();
    expect(screen.getByText("Biografía de prueba.")).toBeInTheDocument();
    expect(screen.getByText("Video de prueba")).toBeInTheDocument();
  });

  it("shows a message when the artist has no videos", async () => {
    mockedGet.mockResolvedValue({
      data: {
        id: "1",
        nombre_artistico: "Söfy",
        nombre_real: null,
        origen: "Huamanga, Ayacucho",
        genero_musical: "Pop en quechua y español",
        biografia: "Biografía de prueba.",
        hito_relevante: "Hito de prueba.",
        videos: [],
      },
    });

    renderWithRoute("1");

    expect(
      await screen.findByText(/no hay videos disponibles/i)
    ).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    mockedGet.mockRejectedValue(new Error("network error"));

    renderWithRoute("1");

    expect(
      await screen.findByText(/error loading artist profile/i)
    ).toBeInTheDocument();
  });
});
