import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserAuthProvider, useUserAuth } from "./UserAuthContext";

const TOKEN_KEY = "takiaway_user_token";
const NAME_KEY = "takiaway_user_name";
const EMAIL_KEY = "takiaway_user_email";

function Probe() {
  const { isAuthenticated, nombre, email, login, logout } = useUserAuth();
  return (
    <div>
      <span data-testid="status">
        {isAuthenticated ? `logged-in:${nombre}:${email}` : "logged-out"}
      </span>
      <button onClick={() => login("token-123", "Carmen", "carmen@example.com")}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <UserAuthProvider>
      <Probe />
    </UserAuthProvider>
  );
}

describe("UserAuthContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("starts logged out when sessionStorage is empty", () => {
    renderProbe();
    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
  });

  it("logs in, updates state, and persists to sessionStorage", () => {
    renderProbe();

    fireEvent.click(screen.getByText("login"));

    expect(screen.getByTestId("status")).toHaveTextContent(
      "logged-in:Carmen:carmen@example.com"
    );
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe("token-123");
    expect(sessionStorage.getItem(NAME_KEY)).toBe("Carmen");
    expect(sessionStorage.getItem(EMAIL_KEY)).toBe("carmen@example.com");
  });

  it("logs out, clears state, and removes sessionStorage entries", () => {
    renderProbe();

    fireEvent.click(screen.getByText("login"));
    fireEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(sessionStorage.getItem(NAME_KEY)).toBeNull();
    expect(sessionStorage.getItem(EMAIL_KEY)).toBeNull();
  });

  it("restores an existing session from sessionStorage on mount", () => {
    sessionStorage.setItem(TOKEN_KEY, "persisted-token");
    sessionStorage.setItem(NAME_KEY, "Persisted User");
    sessionStorage.setItem(EMAIL_KEY, "persisted@example.com");

    renderProbe();

    expect(screen.getByTestId("status")).toHaveTextContent(
      "logged-in:Persisted User:persisted@example.com"
    );
  });

  it("throws a clear error when used outside the provider", () => {
    const consoleError = console.error;
    console.error = () => {};

    expect(() => render(<Probe />)).toThrow(
      "useUserAuth debe usarse dentro de un UserAuthProvider"
    );

    console.error = consoleError;
  });
});
