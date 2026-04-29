import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "../components/shared/ServiceWorkerRegister";
import { ThemeProvider } from "../components/shared/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

// 1. Next.js magic: We just add the manifest path here, and Next.js puts it in the <head> for us
export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build streaks",
  manifest: "/manifest.json",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* 2. Drop our invisible component here to register the SW on page load */}
        <ServiceWorkerRegister />
        {/* Wrap children in the provider! */}
        {<ThemeProvider>
          {children}
        </ThemeProvider>}
      </body>
    </html>
  );
};

export default RootLayout;
