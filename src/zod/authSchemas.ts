import { z } from "zod";
import { AUTH_SCHEMA_MESSAGES } from "@/config/messageConstants";
import { AUTH_REGEX } from "@/config/regexConstants";

export const mobileSchema = z.string().regex(AUTH_REGEX.mobile10DigitIndian, AUTH_SCHEMA_MESSAGES.mobileInvalid);

export const otpSchema = z.string().regex(AUTH_REGEX.otp6Digit, AUTH_SCHEMA_MESSAGES.otpInvalid);

export const registrationSchema = z.object({
  mobile: mobileSchema,
  fullName: z.string().min(1, AUTH_SCHEMA_MESSAGES.fullNameRequired),
  email: z.string().email(AUTH_SCHEMA_MESSAGES.emailInvalid),
});

export const registrationDetailsSchema = z.object({
  experience: z
    .string()
    .min(1, AUTH_SCHEMA_MESSAGES.experienceRequired)
    .refine((v) => Number(v) >= 0, AUTH_SCHEMA_MESSAGES.experienceRequired),
  languagesKnown: z.array(z.string()).min(1, AUTH_SCHEMA_MESSAGES.languagesRequired),
  serviceLocation: z.string().min(1, AUTH_SCHEMA_MESSAGES.serviceLocationRequired),
});

export const validateWithSchema = (schema: z.ZodTypeAny, fallback: string) => (value: string) => {
  const parsed = schema.safeParse(value);
  return parsed.success ? true : parsed.error.issues[0]?.message || fallback;
};
