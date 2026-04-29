"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveUsers, saveSession } from "../../lib/storage";

export const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email and password are required.");
    }

    const users = getUsers();

    // Rule: duplicate email signup must be rejected with specific message
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return setError("User already exists");
    }

    // Create the new user object matching our TypeScript type
    const newUser = {
      id: crypto.randomUUID(), // Built-in browser function to generate a unique ID
      email,
      password, // In a real app we'd hash this, but local storage is fine for the spec!
      createdAt: new Date().toISOString(),
    };

    // Save to "database" and log them in immediately
    saveUsers([...users, newUser]);
    saveSession({ userId: newUser.id, email: newUser.email });

    // Redirect to the protected dashboard
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Sign Up
      </h2>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          data-testid="auth-signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>

      <button
        data-testid="auth-signup-submit"
        type="submit"
        className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Sign Up
      </button>

      <p className="text-sm text-center mt-2 text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
