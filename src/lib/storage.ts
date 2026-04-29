import { User, Session } from "../types/auth";
import { Habit } from "../types/habit";

// We wrap the keys in constants to avoid typos
export const STORAGE_KEYS = {
  USERS: "habit-tracker-users",
  SESSION: "habit-tracker-session",
  HABITS: "habit-tracker-habits",
};

// --- GENERIC HELPERS ---
// This safely checks if we are in the browser
const isBrowser = typeof window !== "undefined";

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// --- USERS ---
export const getUsers = (): User[] =>
  getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
export const saveUsers = (users: User[]): void =>
  setStorageItem(STORAGE_KEYS.USERS, users);

// --- SESSION ---
export const getSession = (): Session | null =>
  getStorageItem<Session | null>(STORAGE_KEYS.SESSION, null);
export const saveSession = (session: Session | null): void =>
  setStorageItem(STORAGE_KEYS.SESSION, session);

// --- HABITS ---
export const getHabits = (): Habit[] =>
  getStorageItem<Habit[]>(STORAGE_KEYS.HABITS, []);
export const saveHabits = (habits: Habit[]): void =>
  setStorageItem(STORAGE_KEYS.HABITS, habits);

