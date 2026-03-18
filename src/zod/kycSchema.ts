import { z } from "zod";
import { KYC_REGEX } from "@/config/regexConstants";
import { KYC_SCHEMA_MESSAGES } from "@/config/messageConstants";

export const aadhaarSectionSchema = z.object({
  aadhaarNumber: z
    .string()
    .min(1, KYC_SCHEMA_MESSAGES.aadhaarRequired)
    .regex(KYC_REGEX.aadhaar, KYC_SCHEMA_MESSAGES.aadhaarInvalid),
  aadhaarFront: z.string().min(1, KYC_SCHEMA_MESSAGES.aadhaarFrontRequired),
  aadhaarBack: z.string().min(1, KYC_SCHEMA_MESSAGES.aadhaarBackRequired),
});

export const panSectionSchema = z.object({
  panNumber: z
    .string()
    .min(1, KYC_SCHEMA_MESSAGES.panRequired)
    .regex(KYC_REGEX.pan, KYC_SCHEMA_MESSAGES.panInvalid),
  panDocument: z.string().min(1, KYC_SCHEMA_MESSAGES.panDocRequired),
});

export const bankDetailsSectionSchema = z.object({
  accountHolderName: z.string().min(1, KYC_SCHEMA_MESSAGES.accountHolderRequired),
  accountNumber: z
    .string()
    .min(1, KYC_SCHEMA_MESSAGES.accountNumberRequired)
    .regex(KYC_REGEX.accountNumber, KYC_SCHEMA_MESSAGES.accountNumberInvalid),
  ifscCode: z
    .string()
    .min(1, KYC_SCHEMA_MESSAGES.ifscRequired)
    .regex(KYC_REGEX.ifsc, KYC_SCHEMA_MESSAGES.ifscInvalid),
  bankName: z.string().min(1, KYC_SCHEMA_MESSAGES.bankNameRequired),
});

export const kycSchema = aadhaarSectionSchema
  .merge(panSectionSchema)
  .merge(bankDetailsSectionSchema);

export type KycFormValues = z.infer<typeof kycSchema>;
