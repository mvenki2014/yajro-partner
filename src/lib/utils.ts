import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { KycStatus } from "./api";
import { EncryptionService } from "./encryption";

/**
 * Combine tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Date to ISO string (YYYY-MM-DD)
 */
export function toISO(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format ISO string (YYYY-MM-DD) to ordinal date (e.g., 2nd Mar)
 */
export function formatShortOrdinalDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;

  const day = parsed.getDate();
  const month = parsed.toLocaleDateString(undefined, { month: "short" });

  const mod10 = day % 10;
  const mod100 = day % 100;
  const suffix =
    mod10 === 1 && mod100 !== 11
      ? "st"
      : mod10 === 2 && mod100 !== 12
        ? "nd"
        : mod10 === 3 && mod100 !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month}`;
}

/**
 * Handle key down for tag input (Enter, Comma, Space)
 */
export const handleTagKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  tagInput: string,
  addTag: (tag: string) => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag(tagInput);
  } else if (e.key === "," || e.key === " ") {
    if (tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  }
};


/**
 * Maps KYC status strings to badge labels and UI variants.
 * Centralizes the logic for consistent status representation across the app.
 */
export const getKycBadge = (status: KycStatus | string) => {
  // Normalize status to uppercase to handle potential backend variations
  const normalizedStatus = status?.toUpperCase();

  switch (normalizedStatus) {
    case "APPROVED":
      return { label: "Verified", variant: "success" as const };
    case "PENDING":
      return { label: "Draft", variant: "neutral" as const };
    case "REVIEW":
    case "IN_REVIEW":
      return { label: "In Review", variant: "warning" as const };
    case "REJECTED":
      return { label: "Rejected", variant: "destructive" as const };
    default:
      return { label: "Action required", variant: "secondary" as const };
  }
};
