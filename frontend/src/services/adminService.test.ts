import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getContactMessages, deleteContactMessage } from "./adminService";

vi.mock("axios");

describe("adminService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getContactMessages sends the auth header and returns the messages", async () => {
    const data = [{ id: "1", nombre: "Carmen", email: "c@example.com", mensaje: "Hola", tipo: "consulta", fecha_creacion: "2026-01-01" }];
    (axios.get as any).mockResolvedValue({ data });

    const result = await getContactMessages("token-abc");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/contact-messages"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
    expect(result).toEqual(data);
  });

  it("deleteContactMessage deletes the correct endpoint with the auth header", async () => {
    (axios.delete as any).mockResolvedValue({});

    await deleteContactMessage("token-abc", "msg-1");

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/contact-messages/msg-1"),
      { headers: { Authorization: "Bearer token-abc" } }
    );
  });
});
