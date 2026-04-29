"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveSession } from "../../lib/storage";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    // Rule: invalid login must show this exact message
    if (!user) {
      return setError("Invalid email or password");
    }

    // Success! Create session and redirect
    saveSession({ userId: user.id, email: user.email });
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Log In
      </h2>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>

      <button
        data-testid="auth-login-submit"
        type="submit"
        className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        Log In
      </button>

      <p className="text-sm text-center mt-2 text-gray-600">
        Dont have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;