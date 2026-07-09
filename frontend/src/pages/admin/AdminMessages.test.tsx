import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminMessages from "./AdminMessages";
import { AuthProvider } from "../../context/AuthContext";
import * as adminService from "../../services/adminService";

const renderAdminMessages = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <AdminMessages />
      </AuthProvider>
    </MemoryRouter>
  );

describe("AdminMessages page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("shows a loading state and then renders messages", async () => {
    sessionStorage.setItem("takiaway_admin_token", "fake-jwt-token");
    vi.spyOn(adminService, "getContactMessages").mockResolvedValue([
      {
        id: "1",
        nombre: "Carmen Test",
        email: "carmen@example.com",
        mensaje: "Hola, quiero saber mas sobre TakiAway.",
        fecha_creacion: "2026-07-08T14:02:22.483487",
      },
    ]);

    renderAdminMessages();

    expect(screen.getByText(/cargando mensajes/i)).toBeInTheDocument();

    expect(await screen.findByText("Carmen Test")).toBeInTheDocument();
    expect(screen.getByText("carmen@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(/hola, quiero saber mas sobre takiaway/i)
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no messages", async () => {
    sessionStorage.setItem("takiaway_admin_token", "fake-jwt-token");
    vi.spyOn(adminService, "getContactMessages").mockResolvedValue([]);

    renderAdminMessages();

    expect(
      await screen.findByText(/aún no hay mensajes de contacto/i)
    ).toBeInTheDocument();
  });

  it("shows an error state when the request fails", async () => {
    sessionStorage.setItem("takiaway_admin_token", "fake-jwt-token");
    vi.spyOn(adminService, "getContactMessages").mockRejectedValue(
      new Error("network error")
    );

    renderAdminMessages();

    expect(
      await screen.findByText(/ocurrió un error al cargar los mensajes/i)
    ).toBeInTheDocument();
  });
});
