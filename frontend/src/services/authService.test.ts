import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { login } from "./authService";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = axios.post as unknown as ReturnType<typeof vi.fn>;

describe("authService", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("logs in an admin and returns the access token", async () => {
    const payload = { email: "admin@takiaway.com", password: "secret123" };
    const responseData = { access_token: "fake-token", token_type: "bearer" };
    mockedPost.mockResolvedValue({ data: responseData });

    const result = await login(payload);

    expect(mockedPost).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/login"),
      payload
    );
    expect(result).toEqual(responseData);
  });

  it("propagates an error when login fails", async () => {
    mockedPost.mockRejectedValue(new Error("invalid credentials"));

    await expect(
      login({ email: "admin@takiaway.com", password: "wrong" })
    ).rejects.toThrow("invalid credentials");
  });
});
