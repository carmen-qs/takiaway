import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getContactMessages } from "./adminService";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = axios.get as unknown as ReturnType<typeof vi.fn>;

describe("adminService", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("fetches contact messages with the auth token in the headers", async () => {
    const messages = [
      {
        id: "1",
        nombre: "Carmen",
        email: "carmen@example.com",
        mensaje: "Hola",
        fecha_creacion: "2026-07-09T00:00:00Z",
      },
    ];
    mockedGet.mockResolvedValue({ data: messages });

    const result = await getContactMessages("fake-token");

    expect(mockedGet).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/contact-messages"),
      { headers: { Authorization: "Bearer fake-token" } }
    );
    expect(result).toEqual(messages);
  });

  it("propagates an error when the request fails", async () => {
    mockedGet.mockRejectedValue(new Error("unauthorized"));

    await expect(getContactMessages("bad-token")).rejects.toThrow(
      "unauthorized"
    );
  });
});
