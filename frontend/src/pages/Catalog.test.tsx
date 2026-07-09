import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { UserAuthProvider } from "../context/UserAuthContext";
import Catalog from "./Catalog";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = axios.get as unknown as ReturnType<typeof vi.fn>;

const artistsData = [
  {
    id: "1",
    nombre_artistico: "Renata Flores Rivera",
    origen: "Huamanga, Ayacucho",
    genero_musical: "Trap y pop andino en quechua",
  },
  {
    id: "2",
    nombre_artistico: "Kayfex",
    origen: "Ayacucho",
    genero_musical: "Producción electrónica y sonidos andinos",
  },
];

const genresData = [
  "Trap y pop andino en quechua",
  "Producción electrónica y sonidos andinos",
];

function renderCatalog() {
  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    </UserAuthProvider>,
  );
}

describe("Catalog page", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedGet.mockImplementation((url: string) => {
      if (url.includes("/genres")) {
        return Promise.resolve({ data: genresData });
      }
      return Promise.resolve({ data: artistsData });
    });
  });

  it("renders the list of artists returned by the API", async () => {
    renderCatalog();

    expect(await screen.findByText("Renata Flores Rivera")).toBeInTheDocument();
    expect(screen.getByText("Kayfex")).toBeInTheDocument();
  });

  it("shows an empty state message when no artists are returned", async () => {
    mockedGet.mockImplementation((url: string) => {
      if (url.includes("/genres")) {
        return Promise.resolve({ data: genresData });
      }
      return Promise.resolve({ data: [] });
    });

    renderCatalog();

    expect(
      await screen.findByText(/no se encontraron artistas/i),
    ).toBeInTheDocument();
  });

  it("requests artists filtered by genre when a genre is selected", async () => {
    renderCatalog();

    await screen.findByText("Renata Flores Rivera");

    const select = await screen.findByLabelText(/filtrar por género/i);
    fireEvent.change(select, { target: { value: genresData[0] } });

    await waitFor(() => {
      const calledWithGenreFilter = mockedGet.mock.calls.some(
        (call: any[]) =>
          call[0].includes("/artists") && call[0].includes("genre="),
      );
      expect(calledWithGenreFilter).toBe(true);
    });
  });
});
