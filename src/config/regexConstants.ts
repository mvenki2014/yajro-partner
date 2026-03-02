export const AUTH_REGEX = {
  mobile10DigitIndian: /^[6-9]\d{9}$/,
  otp6Digit: /^\d{6}$/,
  nonDigitGlobal: /\D/g,
} as const;

