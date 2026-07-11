import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TOKEN_KEY = "takiaway_admin_token";

function Probe() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">
        {isAuthenticated ? "logged-in" : "logged-out"}
      </span>
      <button onClick={() => login("admin-token-123")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("starts logged out when sessionStorage is empty", () => {
    renderProbe();
    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
  });

  it("logs in and persists the token to sessionStorage", () => {
    renderProbe();
    fireEvent.click(screen.getByText("login"));

    expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("admin-token-123");
  });

  it("logs out and clears sessionStorage", () => {
    renderProbe();
    fireEvent.click(screen.getByText("login"));
    fireEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("restores an existing session from sessionStorage on mount", () => {
    sessionStorage.setItem(TOKEN_KEY, "persisted-token");
    renderProbe();
    expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
  });

  it("throws a clear error when used outside the provider", () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => render(<Probe />)).toThrow(
      "useAuth debe usarse dentro de un AuthProvider"
    );

    console.error = consoleError;
  });
});
