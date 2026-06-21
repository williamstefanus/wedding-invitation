import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";

/**
 * Merges class names, deduplicating Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object.
 * @param date  - ISO string or Date
 * @param fmt   - date-fns format string (default: "d MMMM yyyy")
 * @param locale - locale for date-fns (default: Indonesian)
 */
export function formatDate(
  date: string | Date | null | undefined,
  fmt = "d MMMM yyyy",
  locale = localeId
): string {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "";
  return format(d, fmt, { locale });
}

/**
 * Formats a time string "HH:mm:ss" → "HH.mm WIB" (or custom suffix).
 */
export function formatTime(
  time: string | null | undefined,
  suffix = "WIB"
): string {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length < 2) return time;
  return `${parts[0]}.${parts[1]} ${suffix}`;
}

/**
 * Generates the full public invite URL for a given event type and code.
 */
export function generateInviteUrl(
  eventType: "wedding" | "sangjit",
  code: string,
  baseUrl?: string
): string {
  const base =
    baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/invite/${eventType}/${encodeURIComponent(code)}`;
}

/**
 * Truncates a string to a max length with an ellipsis.
 */
export function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max - 1)}…`;
}

/**
 * Returns initials from a full name (up to 2 chars).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * Copies text to clipboard. Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
