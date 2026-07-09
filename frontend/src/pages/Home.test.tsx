import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/UserAuthContext";
import Home from "./Home";

function renderHome() {
  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </UserAuthProvider>
  );
}

describe("Home page", () => {
  it("renders the hero title", () => {
    renderHome();
    expect(
      screen.getByText("Artistas", { selector: "h1" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ayacuchanos")).toBeInTheDocument();
  });

  it("renders the call-to-action button", () => {
    renderHome();
    expect(
      screen.getByRole("button", { name: /explorar artistas/i })
    ).toBeInTheDocument();
  });

  it("renders the 'Conoce a los artistas' section", () => {
    renderHome();
    expect(screen.getByText(/conoce a los artistas/i)).toBeInTheDocument();
  });
});
