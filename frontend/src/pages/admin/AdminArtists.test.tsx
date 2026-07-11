import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import AdminArtists from "./AdminArtists";
import * as adminArtistService from "../../services/adminArtistService";

const artistsData = [
  {
    id: "1",
    nombre_artistico: "Renata Flores Rivera",
    nombre_real: "Renata Flores",
    origen: "Huamanga, Ayacucho",
    genero_musical: "Trap y pop andino",
    biografia: "Bio",
    hito_relevante: "Hito",
    fuente_url: "http://example.com",
    foto_url: "",
    videos: [],
  },
];

function renderPage() {
  sessionStorage.setItem("takiaway_admin_token", "fake-admin-token");
  return render(
    <AuthProvider>
      <BrowserRouter>
        <AdminArtists />
      </BrowserRouter>
    </AuthProvider>
  );
}

describe("AdminArtists page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("shows a loading state, then renders the artist list", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue(artistsData);

    renderPage();

    expect(screen.getByText(/cargando artistas/i)).toBeInTheDocument();
    expect(
      await screen.findByText("Renata Flores Rivera")
    ).toBeInTheDocument();
  });

  it("shows an error message when loading artists fails", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockRejectedValue(
      new Error("network error")
    );

    renderPage();

    expect(
      await screen.findByText(/error al cargar artistas/i)
    ).toBeInTheDocument();
  });

  it("opens the create form, validates required fields, and creates an artist", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([]);
    const createSpy = vi
      .spyOn(adminArtistService, "createArtist")
      .mockResolvedValue({ ...artistsData[0], id: "2" });

    renderPage();
    await screen.findByText(/\+ nuevo artista/i);

    fireEvent.click(screen.getByText(/\+ nuevo artista/i));

    fireEvent.click(screen.getByText("Guardar"));
    expect(
      await screen.findByText(/nombre artístico, origen y género/i)
    ).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText("Nombre artístico"), {
      target: { value: "Nuevo Artista" },
    });
    fireEvent.change(screen.getByPlaceholderText(/origen/i), {
      target: { value: "Ayacucho" },
    });
    fireEvent.change(screen.getByPlaceholderText("Género musical"), {
      target: { value: "Genero Nuevo" },
    });

    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([
      { ...artistsData[0], id: "2", nombre_artistico: "Nuevo Artista" },
    ]);

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
  });

  it("opens the edit form pre-filled with the artist's data and updates it", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue(artistsData);
    const updateSpy = vi
      .spyOn(adminArtistService, "updateArtist")
      .mockResolvedValue(artistsData[0]);

    renderPage();
    await screen.findByText("Renata Flores Rivera");

    fireEvent.click(screen.getByText("Editar"));

    const nameInput = screen.getByPlaceholderText(
      "Nombre artístico"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Renata Flores Rivera");

    fireEvent.change(nameInput, { target: { value: "Nombre Editado" } });
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => expect(updateSpy).toHaveBeenCalledTimes(1));
    expect(updateSpy).toHaveBeenCalledWith(
      "fake-admin-token",
      "1",
      expect.objectContaining({ nombre_artistico: "Nombre Editado" })
    );
  });

  it("shows a save error message when create/update fails", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([]);
    vi.spyOn(adminArtistService, "createArtist").mockRejectedValue(
      new Error("network error")
    );

    renderPage();
    await screen.findByText(/\+ nuevo artista/i);
    fireEvent.click(screen.getByText(/\+ nuevo artista/i));

    fireEvent.change(screen.getByPlaceholderText("Nombre artístico"), {
      target: { value: "Artista Error" },
    });
    fireEvent.change(screen.getByPlaceholderText(/origen/i), {
      target: { value: "Ayacucho" },
    });
    fireEvent.change(screen.getByPlaceholderText("Género musical"), {
      target: { value: "Genero" },
    });

    fireEvent.click(screen.getByText("Guardar"));

    expect(
      await screen.findByText(/ocurrió un error al guardar/i)
    ).toBeInTheDocument();
  });

  it("deletes an artist after confirming", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue(artistsData);
    const deleteSpy = vi
      .spyOn(adminArtistService, "deleteArtist")
      .mockResolvedValue(undefined);

    renderPage();
    await screen.findByText("Renata Flores Rivera");

    fireEvent.click(screen.getByText("Eliminar"));
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith("fake-admin-token", "1"));
    await waitFor(() =>
      expect(screen.queryByText("Renata Flores Rivera")).not.toBeInTheDocument()
    );
  });

  it("cancels a pending delete confirmation without deleting", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue(artistsData);
    const deleteSpy = vi.spyOn(adminArtistService, "deleteArtist");

    renderPage();
    await screen.findByText("Renata Flores Rivera");

    fireEvent.click(screen.getByText("Eliminar"));
    fireEvent.click(screen.getByText("Cancelar"));

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Renata Flores Rivera")).toBeInTheDocument();
  });

  it("adds and removes video rows in the form", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([]);

    renderPage();
    await screen.findByText(/\+ nuevo artista/i);
    fireEvent.click(screen.getByText(/\+ nuevo artista/i));

    fireEvent.click(screen.getByText(/\+ agregar video/i));
    expect(screen.getByPlaceholderText("YouTube video ID")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("✕")[0]);
    expect(screen.queryByPlaceholderText("YouTube video ID")).not.toBeInTheDocument();
  });

  it("closes the form when cancel is clicked", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([]);

    renderPage();
    await screen.findByText(/\+ nuevo artista/i);
    fireEvent.click(screen.getByText(/\+ nuevo artista/i));
    expect(screen.getByText("Nuevo artista")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.queryByText("Nuevo artista")).not.toBeInTheDocument();
  });

  it("logs out and navigates to admin login", async () => {
    vi.spyOn(adminArtistService, "getArtists").mockResolvedValue([]);

    renderPage();
    await screen.findByText(/\+ nuevo artista/i);

    fireEvent.click(screen.getByText("Cerrar sesión"));

    expect(sessionStorage.getItem("takiaway_admin_token")).toBeNull();
  });
});
