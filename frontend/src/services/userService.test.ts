import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { registerUser, loginUser } from "./userService";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;

describe("userService", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("registers a user and returns the created user data", async () => {
    const payload = {
      nombre: "Carmen",
      email: "carmen@example.com",
      password: "secret123",
    };
    const responseData = {
      id: "abc-123",
      nombre: "Carmen",
      email: "carmen@example.com",
    };
    mockedPost.mockResolvedValue({ data: responseData });

    const result = await registerUser(payload);

    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/register"),
      payload
    );
    expect(result).toEqual(responseData);
  });

  it("propagates an error when registration fails", async () => {
    mockedPost.mockRejectedValue(new Error("network error"));

    await expect(
      registerUser({
        nombre: "Carmen",
        email: "carmen@example.com",
        password: "secret123",
      })
    ).rejects.toThrow("network error");
  });

  it("logs in a user and returns the access token", async () => {
    const payload = { email: "carmen@example.com", password: "secret123" };
    const responseData = {
      access_token: "fake-token",
      token_type: "bearer",
      nombre: "Carmen",
      email: "carmen@example.com",
    };
    mockedPost.mockResolvedValue({ data: responseData });

    const result = await loginUser(payload);

    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/login"),
      payload
    );
    expect(result).toEqual(responseData);
  });

  it("propagates an error when login fails", async () => {
    mockedPost.mockRejectedValue(new Error("network error"));

    await expect(
      loginUser({ email: "carmen@example.com", password: "wrong" })
    ).rejects.toThrow("network error");
  });
});
