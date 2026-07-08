import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import About from "./About";

describe("About page", () => {
  it("renders the TakiAway purpose statement", () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(
      screen.getByRole("heading", { name: /nosotros/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/takiaway nace para visibilizar/i)
    ).toBeInTheDocument();
  });
});
