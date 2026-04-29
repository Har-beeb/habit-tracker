export const calculateCurrentStreak = (
  completions: string[],
  today?: string,
): number => {
  // If no "today" is provided, default to the actual current date in YYYY-MM-DD
  const todayStr = today || new Date().toISOString().split("T")[0];

  if (!completions || completions.length === 0) return 0;

  // Rule 1 & 2: Remove duplicates and sort descending (newest to oldest)
  const sortedUniqueDates = Array.from(new Set(completions)).sort((a, b) =>
    b.localeCompare(a),
  );

  // Rule 3: If today is not in the array, the streak is dead (0)
  if (!sortedUniqueDates.includes(todayStr)) {
    return 0;
  }

  let streak = 0;
  // We use standard Date objects to easily subtract days
  const currentCheckDate = new Date(todayStr);

  // Rule 4: Count consecutive calendar days backwards
  for (const dateStr of sortedUniqueDates) {
    // Skip any future dates (just in case they exist)
    if (dateStr > todayStr) continue;

    const expectedStr = currentCheckDate.toISOString().split("T")[0];

    // If the date in the array matches the exact day we are looking for...
    if (dateStr === expectedStr) {
      streak++; // Add 1 to the streak
      currentCheckDate.setDate(currentCheckDate.getDate() - 1); // Step back 1 day for the next loop
    } else {
      // As soon as a day doesn't match, the chain is broken!
      break;
    }
  }

  return streak;
};
