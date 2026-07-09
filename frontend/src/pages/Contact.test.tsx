import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "../context/UserAuthContext";
import Contact from "./Contact";
import * as contactService from "../services/contactService";

function renderContact() {
  return render(
    <UserAuthProvider>
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    </UserAuthProvider>
  );
}

describe("Contact page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a validation error when submitting an empty form", async () => {
    renderContact();

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(
      await screen.findByText(/el nombre es requerido/i)
    ).toBeInTheDocument();
  });

  it("submits the form and shows a success message", async () => {
    const sendSpy = vi
      .spyOn(contactService, "sendContactMessage")
      .mockResolvedValue({
        status: "success",
        message: "Mensaje enviado exitosamente",
      });

    renderContact();

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Carmen" },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "Hola, este es un mensaje de prueba." },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => expect(sendSpy).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByText(/mensaje enviado exitosamente/i)
    ).toBeInTheDocument();
  });

  it("shows an error message when submission fails", async () => {
    vi.spyOn(contactService, "sendContactMessage").mockRejectedValue(
      new Error("network error")
    );

    renderContact();

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Carmen" },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "carmen@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/mensaje/i), {
      target: { value: "Hola, este es un mensaje de prueba." },
    });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(
      await screen.findByText(/ocurrió un error/i)
    ).toBeInTheDocument();
  });
});
