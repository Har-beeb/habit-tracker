import { Habit } from "../types/habit";

export const toggleHabitCompletion = (habit: Habit, date: string): Habit => {
  // We use a Set to guarantee there are never any duplicate dates
  const completionsSet = new Set(habit.completions);

  // If the date is already there, remove it. Otherwise, add it!
  if (completionsSet.has(date)) {
    completionsSet.delete(date);
  } else {
    completionsSet.add(date);
  }

  // We return a BRAND NEW object (...habit) so we do not mutate the original input
  return {
    ...habit,
    completions: Array.from(completionsSet),
  };
};
