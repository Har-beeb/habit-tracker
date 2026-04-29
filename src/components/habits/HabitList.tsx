"use client";

import { useEffect, useState } from "react";
import { Habit } from "../../types/habit";
import { getHabits, getSession } from "../../lib/storage";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  refreshTrigger: number;
  onUpdate: () => void; // NEW: Accept the update function from Dashboard
}

export const HabitList = ({ refreshTrigger, onUpdate }: HabitListProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Standard FSO data-fetching pattern
  useEffect(() => {
    const fetchHabits = async () => {
      const session = getSession();
      if (!session) return;

      const allHabits = getHabits();
      const userHabits = allHabits.filter((h) => h.userId === session.userId);

      // We spread into a new array [...] so we don't accidentally mutate the original data,
      // then reverse it so the newest (last added) becomes the first!
      setHabits([...userHabits].reverse());
    };
    
    fetchHabits();
  }, [refreshTrigger]); // Re-run this effect whenever the trigger changes


  // Rule: When there are no habits for the user, render an empty state
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="mt-8 p-10 dark:bg-slate-800 bg-white rounded-lg shadow-sm border dark:border-gray-700 border-gray-200 text-center"
      >
        <h3 className="text-lg font-medium dark:text-white text-gray-800 mb-2">
          No habits yet
        </h3>
        <p className="text-gray-500">
          Create your first habit above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          // We trigger the Dashboard's global refresh, which instantly updates BOTH the list and the progress bar!
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
