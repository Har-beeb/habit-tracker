// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SignupForm } from "../../src/components/auth/SignupForm";
import { LoginForm } from "../../src/components/auth/LoginForm";
import * as storage from "../../src/lib/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    cleanup(); // <-- This wipes the fake browser screen between tests!
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("submits the signup form and creates a session", () => {
    render(<SignupForm />);

    // Updated IDs to match your actual component!
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@hng.tech" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    const session = storage.getSession();
    expect(session).not.toBeNull();
    expect(session?.userId).toBeDefined();
  });

  it("shows an error for duplicate signup email", () => {
    storage.saveUsers([
      {
        id: "1",
        email: "existing@hng.tech",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "existing@hng.tech" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText(/already exists/i)).toBeDefined();
  });

  it("submits the login form and stores the active session", () => {
    storage.saveUsers([
      {
        id: "user-123",
        email: "login@hng.tech",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<LoginForm />);

    // Updated IDs for the login form!
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@hng.tech" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    const session = storage.getSession();
    expect(session).not.toBeNull();
    expect(session?.userId).toBe("user-123");
  });

  it("shows an error for invalid login credentials", () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@hng.tech" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText(/Invalid/i)).toBeDefined();
    expect(storage.getSession()).toBeNull();
  });
});
