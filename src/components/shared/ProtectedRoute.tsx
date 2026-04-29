"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../../lib/storage";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // 1. We check the session directly, but safely ensure we are in the browser
  const session = typeof window !== "undefined" ? getSession() : null;

  // 2. All hooks are at the top level! No conditionals wrapping our useEffect.
  useEffect(() => {
    // Make sure this key matches your actual app's local storage key!
    const session = localStorage.getItem('habit-tracker-session');
    // If they are in the browser and have no session, kick them out
    if (!session) {
      router.push("/login");
    }
  }, [router]);

  // 3. Early return ONLY happens AFTER all hooks are declared.
  if (!session) {
    return null;
  }

  // 4. Safely render the protected content
  return <>{children}</>;
};
