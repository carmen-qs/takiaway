import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { UserAuthProvider, useUserAuth } from "../context/UserAuthContext";
import * as favoriteService from "../services/favoriteService";
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

function LoginHelper() {
  const { login } = useUserAuth();
  return (
    <button onClick={() => login("token-abc", "Carmen", "carmen@example.com")}>
      do-login
    </button>
  );
}

function renderCatalog({ withLoginHelper = false } = {}) {
  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <Catalog />
        {withLoginHelper && <LoginHelper />}
      </BrowserRouter>
    </UserAuthProvider>,
  );
}

describe("Catalog page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
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

  it("does not show favorite buttons when logged out", async () => {
    renderCatalog();
    await screen.findByText("Renata Flores Rivera");

    expect(screen.queryByLabelText(/favoritos/i)).not.toBeInTheDocument();
  });

  it("loads favorite ids and marks the matching artist as favorite when logged in", async () => {
    vi.spyOn(favoriteService, "getFavoriteIds").mockResolvedValue(["1"]);

    renderCatalog({ withLoginHelper: true });
    fireEvent.click(screen.getByText("do-login"));

    await screen.findByText("Renata Flores Rivera");

    await waitFor(() => {
      expect(screen.getByLabelText("Quitar de favoritos")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Agregar a favoritos")).toBeInTheDocument();
  });

  it("adds a favorite optimistically when the heart button is clicked", async () => {
    vi.spyOn(favoriteService, "getFavoriteIds").mockResolvedValue([]);
    const addSpy = vi
      .spyOn(favoriteService, "addFavorite")
      .mockResolvedValue(undefined);

    renderCatalog({ withLoginHelper: true });
    fireEvent.click(screen.getByText("do-login"));

    await screen.findByText("Renata Flores Rivera");
    const [firstHeart] = await screen.findAllByLabelText("Agregar a favoritos");

    fireEvent.click(firstHeart);

    await waitFor(() => expect(addSpy).toHaveBeenCalledWith("token-abc", "1"));
  });

  it("reverts the optimistic update when adding a favorite fails", async () => {
    vi.spyOn(favoriteService, "getFavoriteIds").mockResolvedValue([]);
    vi.spyOn(favoriteService, "addFavorite").mockRejectedValue(
      new Error("network error"),
    );

    renderCatalog({ withLoginHelper: true });
    fireEvent.click(screen.getByText("do-login"));

    await screen.findByText("Renata Flores Rivera");
    const [firstHeart] = await screen.findAllByLabelText("Agregar a favoritos");

    fireEvent.click(firstHeart);

    await waitFor(() => {
      expect(screen.getAllByLabelText("Agregar a favoritos").length).toBe(2);
    });
  });

  it("removes a favorite when the filled heart button is clicked", async () => {
    vi.spyOn(favoriteService, "getFavoriteIds").mockResolvedValue(["1"]);
    const removeSpy = vi
      .spyOn(favoriteService, "removeFavorite")
      .mockResolvedValue(undefined);

    renderCatalog({ withLoginHelper: true });
    fireEvent.click(screen.getByText("do-login"));

    await screen.findByText("Renata Flores Rivera");
    const filledHeart = await screen.findByLabelText("Quitar de favoritos");

    fireEvent.click(filledHeart);

    await waitFor(() =>
      expect(removeSpy).toHaveBeenCalledWith("token-abc", "1"),
    );
  });
});
