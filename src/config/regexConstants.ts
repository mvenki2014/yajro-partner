export const AUTH_REGEX = {
  mobile10DigitIndian: /^[6-9]\d{9}$/,
  otp6Digit: /^\d{6}$/,
  nonDigitGlobal: /\D/g,
} as const;

export const KYC_REGEX = {
  aadhaar: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  accountNumber: /^\d{9,18}$/,
} as const;

