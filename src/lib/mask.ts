/**
 * -------------------------------------------------------
 * Mask Utility
 * -------------------------------------------------------
 * Production-ready masking helpers for sensitive data.
 *
 * Usage:
 * import { mask } from "@/utils/mask";
 *
 * mask.phone("9876543210")
 * mask.email("user@gmail.com")
 * mask.name("Raghavendra Rao")
 * mask.object({ phone: "9876543210", email: "user@gmail.com" })
 *
 * Designed for:
 * - Frontend UI masking
 * - Backend logging
 * - API response sanitization
 *
 * Best Practices:
 * - Pure functions
 * - No dependencies
 * - Fully typed
 * - Safe fallbacks
 * -------------------------------------------------------
 */

export type Maskable = string | number | null | undefined;

/**
 * Normalize input value to string
 */
const normalize = (value?: Maskable): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

/**
 * Mask phone number
 * Example: 9876543210 -> +91 987****210
 */
const phone = (value?: Maskable): string => {
  const raw = normalize(value);

  if (!raw) return "";

  const cleaned = raw.replace(/[^\d+]/g, "");

  const hasCountry = cleaned.startsWith("+");

  const digits = cleaned.replace(/\D/g, "");

  if (digits.length <= 6) return cleaned;

  const masked = digits.replace(/(\d{3})\d+(\d{3})/, "$1****$2");

  if (!hasCountry) return masked;

  // Detect country code length (1–3 digits)
  const countryCode = digits.slice(0, digits.length - 10) || digits.slice(0, 2);
  const rest = masked.slice(countryCode.length);

  return `+${countryCode} ${rest}`;
};

/**
 * Mask email address
 * Example: user@gmail.com -> u***@gmail.com
 */
const email = (value?: Maskable): string => {
  const val = normalize(value);

  const [name, domain] = val.split("@");

  if (!domain) return val;

  return `${name[0]}***@${domain}`;
};

/**
 * Mask person name
 * Example: Raghavendra Rao -> R******** Rao
 */
const name = (value?: Maskable): string => {
  const val = normalize(value);

  if (!val) return "";

  const parts = val.split(" ");

  if (parts.length === 1) {
    return parts[0][0] + "***";
  }

  const first = parts[0][0] + "*".repeat(Math.max(parts[0].length - 1, 3));
  const last = parts[parts.length - 1];

  return `${first} ${last}`;
};

/**
 * Mask credit/debit card
 * Example: 1234123412341234 -> **** **** **** 1234
 */
const card = (value?: Maskable): string => {
  const cleaned = normalize(value).replace(/\s/g, "");

  return cleaned.replace(/\d(?=\d{4})/g, "*");
};

/**
 * Mask Aadhaar
 * Example: 123412341234 -> **** **** 1234
 */
const aadhaar = (value?: Maskable): string => {
  const cleaned = normalize(value).replace(/\s/g, "");

  return cleaned.replace(/\d(?=\d{4})/g, "*");
};

/**
 * Mask order ID
 * Example: ORD-123456 -> ORD-****56
 */
const orderId = (value?: Maskable): string => {
  const val = normalize(value);

  if (val.length <= 2) return val;

  return val.replace(/.(?=.{2})/g, "*");
};

/**
 * Mask address partially
 * Example: Flat 402 Sai Residency -> Flat *** Residency
 */
const address = (value?: Maskable): string => {
  const val = normalize(value);

  const words = val.split(" ");

  if (words.length < 2) return "***";

  return `${words[0]} *** ${words[words.length - 1]}`;
};

const panNumber = (value?: Maskable): string => {
  const val = normalize(value);

  if (val.length <= 6) return val;

  // Example: ABCDE1234F → ABC****34F
  return `${val.slice(0, 3)}****${val.slice(-3)}`;
};


const maskLast = (val: string, visible = 4) =>
  ` ${"*".repeat(Math.max(val.length - visible, 0))} ${val.slice(-visible)}`;

const bankAccount = (value?: Maskable): string => {
  const val = normalize(value);
  // Example: 1234567890 → ******7890
  return val.length <= 4 ? val : maskLast(val, 4);
};

/**
 * Automatically mask sensitive fields in objects
 *
 * Recursively scans object keys and masks:
 * phone, mobile, email, aadhaar, card, password, panNumber, token
 */
const object = <T extends Record<string, any>>(data: T): T => {
  const sensitiveFields = [
    "phone",
    "mobile",
    "email",
    "aadhaar",
    "card",
    "password",
    "panNumber",
    "bankAccount",
    "token"
  ];

  const result: Record<string, any> = {};

  for (const key in data) {
    const value = data[key];

    const lowerKey = key.toLowerCase();

    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = object(value);
      continue;
    }

    if (sensitiveFields.includes(lowerKey)) {
      if (lowerKey.includes("phone") || lowerKey.includes("mobile")) {
        result[key] = phone(value);
      } else if (lowerKey.includes("email")) {
        result[key] = email(value);
      } else if (lowerKey.includes("aadhaar")) {
        result[key] = aadhaar(value);
      } else {
        result[key] = "***";
      }

      continue;
    }

    result[key] = value;
  }

  return result as T;
};

/**
 * Mask API wrapper
 *
 * Example usage:
 * mask.phone()
 * mask.email()
 * mask.name()
 */
export const mask = {
  phone,
  email,
  name,
  address,
  orderId,
  card,
  aadhaar,
  panNumber,
  bankAccount,
  object
};
