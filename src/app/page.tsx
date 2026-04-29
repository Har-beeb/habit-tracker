"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "../components/shared/SplashScreen";
import { getSession } from "../lib/storage";

export const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // The PDF asks to keep the splash screen visible for 800ms to 2000ms
    const timer = setTimeout(() => {
      const session = getSession();

      // Route behavior contract: redirect based on session existence
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1000); // We'll set it to 1000ms (1 second)

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}

export default Home;
