export const getHabitSlug = (name: string): string => {
  return name
    .toLowerCase() // convert to lowercase [cite: 148]
    .trim() // trim leading and trailing spaces [cite: 149]
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters (keep spaces and hyphens) [cite: 151]
    .replace(/\s+/g, "-"); // Now that the weird characters are gone, collapse all remaining spaces into a single hyphen [cite: 150]
};
