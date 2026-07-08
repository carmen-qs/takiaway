import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

describe("Home page", () => {
  it("renders the hero title", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(
      screen.getByText("Artistas", { selector: "h1" })
    ).toBeInTheDocument();
    expect(screen.getByText("Ayacuchanos")).toBeInTheDocument();
  });

  it("renders the call-to-action button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(
      screen.getByRole("button", { name: /explorar artistas/i })
    ).toBeInTheDocument();
  });

  it("renders the 'Conoce a los artistas' section", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/conoce a los artistas/i)).toBeInTheDocument();
  });
});
