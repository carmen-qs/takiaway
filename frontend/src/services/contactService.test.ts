import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { sendContactMessage } from "./contactService";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;

describe("contactService", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("posts the payload to the contact-messages endpoint and returns the response data", async () => {
    const payload = {
      nombre: "Carmen",
      email: "carmen@example.com",
      mensaje: "Hola, quiero saber más.",
    };
    const responseData = {
      status: "success",
      message: "Mensaje enviado exitosamente",
    };
    mockedPost.mockResolvedValue({ data: responseData });

    const result = await sendContactMessage(payload);

    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/contact-messages"),
      payload
    );
    expect(result).toEqual(responseData);
  });

  it("propagates an error when the request fails", async () => {
    mockedPost.mockRejectedValue(new Error("network error"));

    await expect(
      sendContactMessage({
        nombre: "Carmen",
        email: "carmen@example.com",
        mensaje: "Hola",
      })
    ).rejects.toThrow("network error");
  });
});
