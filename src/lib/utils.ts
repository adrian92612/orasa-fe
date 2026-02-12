import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

export const formatDateForInput = (date: string | Date) => {
  const d = new Date(date);
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISOTime = new Date(d.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
};

export const fromDateInput = (dateStr: string) => {
  return new Date(dateStr).toISOString();
};

export const isValidPHPhone = (value: string): boolean => {
  // Only digits, starts with 09, exactly 11 digits
  return /^09\d{9}$/.test(value);
};
