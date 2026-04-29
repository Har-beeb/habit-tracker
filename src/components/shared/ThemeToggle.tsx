"use client";

import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-yellow-400  transition-all active:scale-95"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};
