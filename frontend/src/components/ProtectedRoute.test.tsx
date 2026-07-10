import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as AuthContextModule from "../context/AuthContext";

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin/messages"]}>
      <Routes>
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <div>Contenido protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<div>Pantalla de login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders the protected content when the user is authenticated", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      token: "fake-token",
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("redirects to /admin/login when the user is not authenticated", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      isAuthenticated: false,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });
});
