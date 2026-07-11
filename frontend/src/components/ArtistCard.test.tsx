import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/UserAuthContext";
import ArtistCard from "./ArtistCard";

const artist = {
  id: "1",
  nombre_artistico: "Söfy",
  origen: "Huamanga, Ayacucho",
  genero_musical: "Pop en quechua y español",
};

function renderCard(props = {}, { authenticated = false } = {}) {
  if (authenticated) {
    sessionStorage.setItem("takiaway_user_token", "fake-token");
    sessionStorage.setItem("takiaway_user_name", "Carmen");
    sessionStorage.setItem("takiaway_user_email", "carmen@example.com");
  } else {
    sessionStorage.clear();
  }

  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <ArtistCard artist={artist} {...props} />
      </BrowserRouter>
    </UserAuthProvider>
  );
}

describe("ArtistCard", () => {
  it("renders artist info and links to the artist detail page", () => {
    renderCard();

    expect(screen.getByText("Söfy")).toBeInTheDocument();
    expect(screen.getByText("Huamanga, Ayacucho")).toBeInTheDocument();
    expect(screen.getByText("Pop en quechua y español")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/artist/1");
  });

  it("does not show a favorite button when the user is not authenticated", () => {
    renderCard();
    expect(screen.queryByLabelText(/favoritos/i)).not.toBeInTheDocument();
  });

  it("does not show a favorite button when onToggleFavorite is not provided", () => {
    renderCard({}, { authenticated: true });
    expect(screen.queryByLabelText(/favoritos/i)).not.toBeInTheDocument();
  });

  it("shows the favorite button when authenticated and onToggleFavorite is provided", () => {
    const onToggleFavorite = vi.fn();
    renderCard({ onToggleFavorite }, { authenticated: true });

    expect(
      screen.getByLabelText("Agregar a favoritos")
    ).toBeInTheDocument();
  });

  it("calls onToggleFavorite with the artist id, without navigating", () => {
    const onToggleFavorite = vi.fn();
    renderCard({ onToggleFavorite }, { authenticated: true });

    fireEvent.click(screen.getByLabelText("Agregar a favoritos"));

    expect(onToggleFavorite).toHaveBeenCalledWith("1");
  });

  it("shows filled heart label when isFavorite is true", () => {
    const onToggleFavorite = vi.fn();
    renderCard({ isFavorite: true, onToggleFavorite }, { authenticated: true });

    expect(screen.getByLabelText("Quitar de favoritos")).toBeInTheDocument();
  });
});
