"use client";

import { useState, useEffect } from "react";
import { Habit } from "../../types/habit";
import { getHabitSlug } from "../../lib/slug";
import { calculateCurrentStreak } from "../../lib/streaks";
import { toggleHabitCompletion } from "../../lib/habits";
import { getHabits, saveHabits } from "../../lib/storage";
import confetti from "canvas-confetti";

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void; // We call this to tell the list to refresh when we make changes
}

export const HabitCard = ({ habit, onUpdate }: HabitCardProps) => {
  // We need a specific state to handle the "deletion must require explicit confirmation" rule [cite: 269]
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  // NEW: State to hold our 3-second timer
  const [countdown, setCountdown] = useState(3);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  // NEW: Bulletproof, strictly compliant interval timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConfirmingDelete) {
      // We use setInterval to run every 1000ms automatically
      interval = setInterval(() => {
        setCountdown((prev) => {
          // If we are at 1 and about to hit 0, kill the timer and revert the UI
          if (prev <= 1) {
            clearInterval(interval);
            setIsConfirmingDelete(false);
            return 3; // Reset the timer state for next time
          }
          // Otherwise, just tick down normally
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup: if the user manually clicks "Cancel", this wipes the timer instantly
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConfirmingDelete]); // Notice: 'countdown' is completely gone from the dependencies!

  const handleToggle = () => {
    // If it is NOT currently completed, that means the user is completing it right now!
    if (!isCompletedToday) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }, // Starts the blast slightly below the middle of the screen
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'] // Matches our app colors
      });
    }

    const updatedHabit = toggleHabitCompletion(habit, today);
    const allHabits = getHabits();
    const newHabits = allHabits.map((h) => (h.id === habit.id ? updatedHabit : h));
    
    saveHabits(newHabits);
    onUpdate();
  };

  const handleDelete = () => {
    const allHabits = getHabits();
    const newHabits = allHabits.filter((h) => h.id !== habit.id);
    saveHabits(newHabits);
    onUpdate();
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      /* TAILWIND STYLING EXPLAINED:
         rounded-2xl: Gives it very modern, smooth, pill-like corners.
         transition-all duration-300: Makes every change (hover, color shift) animate smoothly over 0.3 seconds.
         hover:shadow-md hover:-translate-y-1: When hovered, the card lifts up slightly and casts a bigger shadow.
         border-l-4: Adds a thick colored line on the left edge as a visual status indicator.
      */
      className={`group flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl shadow-sm border border-slate-100  transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
        isCompletedToday
          ? "bg-emerald-50/50 border-l-emerald-500 dark:bg-slate-900"
          : "bg-white border-l-blue-500 dark:bg-slate-800 dark:border-slate-700"
      }`}
    >
      {/* LEFT SIDE: Text Content */}
      <div className="flex-1 w-full mb-4 sm:mb-0">
        <h3
          className={`dark:text-white font-bold text-xl tracking-tight transition-colors ${isCompletedToday ? "text-emerald-800 line-through opacity-70" : "text-slate-800"}`}
        >
          {habit.name}
        </h3>
        {habit.description && (
          <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
            {habit.description}
          </p>
        )}

        {/* TAILWIND: A stylish little badge for the streak */}
        <div className="inline-flex items-center mt-3 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
          <span className="mr-1">🔥</span>
          <span data-testid={`habit-streak-${slug}`}>{streak} Day Streak</span>
        </div>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          /* TAILWIND: active:scale-95 makes the button physically shrink a tiny bit when clicked (tactile feedback) */
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm ${
            isCompletedToday
              ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
          }`}
        >
          {isCompletedToday ? "Undo" : "Complete"}
        </button>

        {/* Delete Logic with Auto-Reverting Single Button */}
        {isConfirmingDelete ? (
          <button
            data-testid="confirm-delete-button"
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-all active:scale-95 shadow-sm flex items-center gap-1 w-32 justify-center"
          >
            Confirm{" "}
            <span className="opacity-80 font-normal text-xs">
              ({countdown}s)
            </span>
          </button>
        ) : (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => {
              setIsConfirmingDelete(true);
              setCountdown(3);
            }}
            /* TAILWIND: Fixed width (w-32) prevents the button from resizing wildly when the text changes from "Delete" to "Confirm" */
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-95 w-32 justify-center flex"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};;
