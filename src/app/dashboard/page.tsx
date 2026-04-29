"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../../components/shared/ProtectedRoute";
import { saveSession } from "../../lib/storage";
import { HabitForm } from "../../components/habits/HabitForm";
import { HabitList } from "../../components/habits/HabitList";
import { ProgressBar } from "../../components/habits/ProgressBar";
import { ThemeToggle } from "../../components/shared/ThemeToggle";

const DashboardPage = () => {
  const router = useRouter();
  const [refreshCount, setRefreshCount] = useState(0);

  const handleLogout = () => {
    // Rule: remove the session from localStorage and redirect to /login
    saveSession(null);
    router.push("/login");
  };

  const handleHabitAdded = () => {
    // Incrementing this tells the HabitList to re-fetch the data
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      {/* TAILWIND: Changed background to a sleeker very light gray (bg-slate-50) */}
      <div
        data-testid="dashboard-page"
        className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 font-sans transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-300 font-medium mt-1">
                What are we conquering today?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="text-sm bg-rose-50 dark:bg-rose-600 text-rose-600 dark:text-rose-50 font-bold py-2.5 px-5 rounded-full dark:hover:bg-rose-400 hover:bg-rose-100 transition-all active:scale-95"
              >
                Log Out
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* TAILWIND GRID MAGC: 
              grid-cols-1: Stacks on mobile.
              lg:grid-cols-12: Splits the screen into 12 invisible columns on large screens.
              items-start: Prevents the form from stretching vertically to match the list height.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar (Takes up 4 out of 12 columns on desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-10">
              <HabitForm onSuccess={handleHabitAdded} />
            </div>

            {/* Right Main Content (Takes up 8 out of 12 columns on desktop) */}
            <div className="lg:col-span-8">
              <ProgressBar refreshTrigger={refreshCount} />
              {/* We pass the exact same handleHabitAdded function because it just increments the counter! */}
              <HabitList
                refreshTrigger={refreshCount}
                onUpdate={handleHabitAdded}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;