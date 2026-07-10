import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserAuthProvider } from "../../context/UserAuthContext";
import UserLogin from "./UserLogin";
import * as userService from "../../services/userService";

function renderUserLogin() {
  return render(
    <UserAuthProvider>
      <MemoryRouter>
        <UserLogin />
      </MemoryRouter>
    </UserAuthProvider>
  );
}

describe("UserLogin page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("renders in login mode by default", () => {
    renderUserLogin();
    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/^nombre$/i)).not.toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty login form", async () => {
    renderUserLogin();

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/el correo es requerido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/la contraseña es requerida/i)
    ).toBeInTheDocument();
  });

  it("logs in successfully with valid credentials", async () => {
    const loginSpy = vi.spyOn(userService, "loginUser").mockResolvedValue({
      access_token: "fake-token",
      token_type: "bearer",
      nombre: "Carmen",
      email: "carmen@example.com",
    });

    renderUserLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => expect(loginSpy).toHaveBeenCalledTimes(1));
    expect(loginSpy).toHaveBeenCalledWith({
      email: "carmen@example.com",
      password: "secret123",
    });
  });

  it("shows an error message on invalid credentials (401)", async () => {
    vi.spyOn(userService, "loginUser").mockRejectedValue({
      response: { status: 401 },
    });

    renderUserLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/correo o contraseña incorrectos/i)
    ).toBeInTheDocument();
  });

  it("shows a generic error message for unexpected failures", async () => {
    vi.spyOn(userService, "loginUser").mockRejectedValue(new Error("boom"));

    renderUserLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(
      await screen.findByText(/ocurrió un error/i)
    ).toBeInTheDocument();
  });

  it("switches to register mode and shows the nombre field", () => {
    renderUserLogin();

    fireEvent.click(screen.getByRole("button", { name: /crear una/i }));

    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
  });

  it("shows a validation error for missing nombre in register mode", async () => {
    renderUserLogin();
    fireEvent.click(screen.getByRole("button", { name: /crear una/i }));

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText(/el nombre es requerido/i)
    ).toBeInTheDocument();
  });

  it("registers and logs in successfully", async () => {
    const registerSpy = vi
      .spyOn(userService, "registerUser")
      .mockResolvedValue({
        id: "abc-123",
        nombre: "Carmen",
        email: "carmen@example.com",
      });
    const loginSpy = vi.spyOn(userService, "loginUser").mockResolvedValue({
      access_token: "fake-token",
      token_type: "bearer",
      nombre: "Carmen",
      email: "carmen@example.com",
    });

    renderUserLogin();
    fireEvent.click(screen.getByRole("button", { name: /crear una/i }));

    fireEvent.change(screen.getByLabelText(/^nombre$/i), {
      target: { value: "Carmen" },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => expect(registerSpy).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(loginSpy).toHaveBeenCalledTimes(1));
  });

  it("shows an error when registering with an existing email (409)", async () => {
    vi.spyOn(userService, "registerUser").mockRejectedValue({
      response: { status: 409 },
    });

    renderUserLogin();
    fireEvent.click(screen.getByRole("button", { name: /crear una/i }));

    fireEvent.change(screen.getByLabelText(/^nombre$/i), {
      target: { value: "Carmen" },
    });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText(/ya existe una cuenta con ese correo/i)
    ).toBeInTheDocument();
  });

  it("switches back to login mode from register mode", () => {
    renderUserLogin();
    fireEvent.click(screen.getByRole("button", { name: /crear una/i }));
    fireEvent.click(screen.getByRole("button", { name: /inicia sesión/i }));

    expect(
      screen.getByRole("heading", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });
});
