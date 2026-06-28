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

export function generateInvitationCode(guestName: string): string {
  // Remove non-alphanumeric characters, convert to uppercase, take up to 6 chars
  const cleanName = guestName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 6);
  
  // Generate 4 random alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Fallback if name is empty for some reason
  if (!cleanName) {
    let fallback = '';
    for (let i = 0; i < 8; i++) {
      fallback += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return fallback;
  }
  
  return `${cleanName}-${randomStr}`;
}

import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  // Check if data items are already flat dictionary objects (e.g. from generateExportData) vs raw database objects (from RsvpClient)
  const isPreFormatted = !data[0].guest && !data[0].event_type && (data[0]["Guest Name"] !== undefined || data[0]["Event Name"] !== undefined || data[0]["Table Name"] !== undefined || data[0]["Event"] !== undefined || data[0]["Phone"] !== undefined);

  const formattedData = isPreFormatted ? data : data.map(item => {
    let rsvpData = null;
    if (item.rsvp) {
      if (Array.isArray(item.rsvp)) {
        if (item.rsvp.length > 0) rsvpData = item.rsvp[0];
      } else {
        rsvpData = item.rsvp;
      }
    }
    const isPending = !rsvpData;
    
    return {
      "Guest Name": item.guest?.name || "-",
      "Event Type": item.event_type?.name || "-",
      "Owner": item.guest?.owner || "-",
      "Category": item.guest?.category || "-",
      "Status": isPending ? "Pending" : (rsvpData?.attendance_status === "attending" ? "Attending" : "Declined"),
      "Confirmed Pax": isPending ? 0 : (rsvpData?.confirmed_pax || 0),
      "Max Pax": item.max_pax || 0,
      "Submission Time": isPending ? "-" : new Date(rsvpData?.submitted_at).toLocaleString(),
      "Table Assignment": item.seating_assignment?.[0]?.seating_table?.table_name || "Unassigned",
      "Wishes": isPending ? "-" : (rsvpData?.wish_message || "-"),
      "Invitation Code": item.invitation_code || "-"
    };
  });

  // Create a new workbook and a worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  
  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
