"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // attribute="class" tells next-themes to toggle a "dark" class on the <html> tag
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
};
