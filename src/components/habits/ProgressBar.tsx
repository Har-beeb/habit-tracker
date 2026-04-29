"use client";

import { useEffect, useState } from "react";
import { Habit } from "../../types/habit";
import { getHabits, getSession } from "../../lib/storage";

interface ProgressBarProps {
  refreshTrigger: number;
}

export const ProgressBar = ({ refreshTrigger }: ProgressBarProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // 1. Standard async fetch (exact same safe pattern as HabitList)
  useEffect(() => {
    const fetchHabits = async () => {
      const session = getSession();
      if (!session) return;

      const allHabits = getHabits();
      const userHabits = allHabits.filter((h) => h.userId === session.userId);
      setHabits(userHabits);
    };

    fetchHabits();
  }, [refreshTrigger]);

  // 2. If the user has no habits yet, don't show the progress bar at all
  if (habits.length === 0) return null;

  // 3. The Math
  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((habit) =>
    (habit.completions || []).includes(today),
  ).length;
  const totalHabits = habits.length;
  // FIX 2: Safely handle 0 habits so it doesn't return NaN and break the UI
  const progressPercentage =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  return (
    <div className="dark:bg-slate-800 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">
            Today's Progress
          </h3>
          <p className="text-sm text-slate-500 dark:text-white font-medium">
            {completedToday} of {totalHabits} habits completed
          </p>
        </div>
        <span className="text-3xl font-extrabold text-blue-600 tracking-tighter">
          {progressPercentage}%
        </span>
      </div>

      {/* The Track (Gray Background) */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
        {/* The Fill (Blue Foreground) */}
        <div
          /* TAILWIND: transition-all duration-1000 ease-out creates a super smooth loading animation! */
          className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};;
