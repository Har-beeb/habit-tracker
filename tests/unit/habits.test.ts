import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import { Habit } from "../../src/types/habit";

describe("toggleHabitCompletion", () => {
  // A dummy habit to run our tests against
  const mockHabit: Habit = {
    id: "123",
    userId: "user-1",
    name: "Drink Water",
    description: "Stay hydrated",
    frequency: "daily",
    createdAt: "2026-04-20",
    completions: ["2026-04-25"], // Already completed yesterday
  };

  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(mockHabit, "2026-04-26");
    expect(result.completions).toContain("2026-04-26");
    expect(result.completions.length).toBe(2);
  });

  it("removes a completion date when the date already exists", () => {
    const result = toggleHabitCompletion(mockHabit, "2026-04-25");
    expect(result.completions).not.toContain("2026-04-25");
    expect(result.completions.length).toBe(0);
  });

  it("does not mutate the original habit object", () => {
    const originalCompletions = [...mockHabit.completions];
    const result = toggleHabitCompletion(mockHabit, "2026-04-26");

    // The original should be untouched
    expect(mockHabit.completions).toEqual(originalCompletions);
    // The result must be a completely new object in memory
    expect(result).not.toBe(mockHabit);
  });

  it("does not return duplicate completion dates", () => {
    // We intentionally create a broken habit with duplicates to test our Set logic
    const messyHabit: Habit = {
      ...mockHabit,
      completions: ["2026-04-25", "2026-04-25"],
    };

    const result = toggleHabitCompletion(messyHabit, "2026-04-26");
    // The Set should have collapsed the duplicates AND added the new date
    expect(result.completions).toEqual(["2026-04-25", "2026-04-26"]);
  });
});
