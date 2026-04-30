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
  onUpdate: () => void;
}

export const HabitCard = ({ habit, onUpdate }: HabitCardProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // NEW: Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(
    habit.description || "",
  );

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConfirmingDelete) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsConfirmingDelete(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConfirmingDelete]);

  const handleToggle = () => {
    if (!isCompletedToday) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444"],
      });
    }

    const updatedHabit = toggleHabitCompletion(habit, today);
    const allHabits = getHabits();
    const newHabits = allHabits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );

    saveHabits(newHabits);
    onUpdate();
  };

  const handleDelete = () => {
    const allHabits = getHabits();
    const newHabits = allHabits.filter((h) => h.id !== habit.id);
    saveHabits(newHabits);
    onUpdate();
  };

  // NEW: Save edit logic
  const handleSaveEdit = () => {
    if (!editName.trim()) return; // Prevent empty names

    const allHabits = getHabits();
    const newHabits = allHabits.map((h) =>
      h.id === habit.id
        ? { ...h, name: editName, description: editDescription }
        : h,
    );

    saveHabits(newHabits);
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`group flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl shadow-sm border border-slate-100  transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
        isCompletedToday
          ? "bg-emerald-50/50 border-l-emerald-500 dark:bg-slate-900"
          : "bg-white border-l-blue-500 dark:bg-slate-800 dark:border-slate-700"
      }`}
    >
      {/* LEFT SIDE: Text Content or Edit Inputs */}
      <div className="flex-1 w-full mb-4 sm:mb-0 pr-4">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:bg-slate-700 dark:text-white dark:border-slate-600 font-bold text-xl tracking-tight"
              autoFocus
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 text-sm"
            />
          </div>
        ) : (
          <>
            <h3
              className={`dark:text-white font-bold text-xl tracking-tight transition-colors ${
                isCompletedToday
                  ? "text-emerald-800 line-through opacity-70"
                  : "text-slate-800"
              }`}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
                {habit.description}
              </p>
            )}

            <div className="inline-flex items-center mt-3 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <span className="mr-1">🔥</span>
              <span data-testid={`habit-streak-${slug}`}>
                {streak} Day Streak
              </span>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition-all active:scale-95 shadow-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(habit.name); // Revert name
                setEditDescription(habit.description || ""); // Revert description
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all active:scale-95 shadow-sm dark:bg-slate-600 dark:text-slate-200"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              data-testid={`habit-complete-${slug}`}
              onClick={handleToggle}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm ${
                isCompletedToday
                  ? "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
              }`}
            >
              {isCompletedToday ? "Undo" : "Complete"}
            </button>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all active:scale-95 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-white"
            >
              Edit
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
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-95 w-32 justify-center flex dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-rose-400"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
