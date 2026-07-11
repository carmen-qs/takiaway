import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider, useUserAuth } from "../context/UserAuthContext";
import Header from "./Header";

function LoginHelper() {
  const { login } = useUserAuth();
  return (
    <button onClick={() => login("token-abc", "Carmen", "carmen@example.com")}>
      do-login
    </button>
  );
}

function renderHeader() {
  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <Header />
        <LoginHelper />
      </BrowserRouter>
    </UserAuthProvider>
  );
}

describe("Header", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows a login link when there is no active session", () => {
    renderHeader();
    expect(screen.getAllByText(/iniciar sesión/i).length).toBeGreaterThan(0);
  });

  it("shows the user's name and a logout option after logging in", () => {
    renderHeader();

    fireEvent.click(screen.getByText("do-login"));

    expect(screen.getAllByText(/carmen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cerrar sesión/i).length).toBeGreaterThan(0);
  });

  it("logs out and shows the login link again", () => {
    renderHeader();

    fireEvent.click(screen.getByText("do-login"));
    fireEvent.click(screen.getAllByText(/cerrar sesión/i)[0]);

    expect(screen.getAllByText(/iniciar sesión/i).length).toBeGreaterThan(0);
  });

  it("opens and closes the mobile menu", () => {
    renderHeader();

    const menuButton = screen.getByLabelText(/abrir menú/i);
    fireEvent.click(menuButton);

    const mobileLinks = screen.getAllByText("Contacto");
    expect(mobileLinks.length).toBeGreaterThan(1);
  });
});
