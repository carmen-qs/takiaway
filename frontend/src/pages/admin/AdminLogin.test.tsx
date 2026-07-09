import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import { AuthProvider } from "../../context/AuthContext";
import * as authService from "../../services/authService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderAdminLogin = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    </MemoryRouter>
  );

describe("AdminLogin page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
    sessionStorage.clear();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderAdminLogin();

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/el correo es requerido/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/la contraseña es requerida/i)
    ).toBeInTheDocument();
  });

  it("logs in successfully and redirects to /admin/messages", async () => {
    vi.spyOn(authService, "login").mockResolvedValue({
      access_token: "fake-jwt-token",
      token_type: "bearer",
    });

    renderAdminLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@takiaway.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "MiClaveSegura123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/admin/messages"));
    expect(sessionStorage.getItem("takiaway_admin_token")).toBe("fake-jwt-token");
  });

  it("shows an error message on invalid credentials", async () => {
    vi.spyOn(authService, "login").mockRejectedValue({
      response: { status: 401 },
    });

    renderAdminLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@takiaway.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "ContraseñaMala" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/correo o contraseña incorrectos/i)
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
