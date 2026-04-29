"use client";

import { useState } from "react";
import { Habit } from "../../types/habit";
import { getHabits, saveHabits, getSession } from "../../lib/storage";
import { validateHabitName } from "../../lib/validators";

export const HabitForm = ({ onSuccess }: { onSuccess: () => void }) => {
  // Pure, standard React state (FSO style)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // The frequency must default to daily
  const [frequency, setFrequency] = useState<"daily">("daily");
  const [error, setError] = useState<string | null>(null);

  // Using the up-to-date SubmitEvent instead of the deprecated FormEvent
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Run our tested validator
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return; // Early return, standard React best practice
    }

    // 2. Safely grab the session
    const session = getSession();
    if (!session) return;

    // 3. Construct the new habit matching the exact Type contract
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: validation.value,
      description: description.trim(),
      frequency,
      createdAt: new Date().toISOString().split("T")[0],
      completions: [],
    };

    // 4. Save to our local storage "database"
    const existingHabits = getHabits();
    saveHabits([...existingHabits, newHabit]);

    // 5. Clean up the form and notify the parent component
    setName("");
    setDescription("");
    onSuccess();
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border dark:bg-slate-800 dark:border-gray-700 border-slate-100 sticky top-10"
    >
      <h2 className="text-xl font-bold dark:text-white text-gray-800">
        Create a Habit
      </h2>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-white text-gray-700">
          Name
        </label>
        <input
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border dark:border-gray-700 border-gray-300 rounded px-3 py-2 dark:text-white text-black"
          placeholder="e.g. Drink Water"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-white text-gray-700">
          Description (Optional)
        </label>
        <textarea
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border dark:border-gray-700 border-gray-300 rounded px-3 py-2 dark:text-white text-black"
          placeholder="Why are you building this habit?"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium dark:text-white text-gray-700">
          Frequency
        </label>
        <select
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily")}
          className="border dark:border-gray-700 border-gray-300 rounded px-3 py-2 dark:bg-gray-700 bg-gray-50 dark:text-white text-black"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <button
        data-testid="habit-save-button"
        type="submit"
        className="rounded-xl active:scale-95 mt-2 bg-blue-600 text-white font-bold py-2 px-4 hover:bg-blue-700 transition-colors"
      >
        Save Habit
      </button>
    </form>
  );
};
