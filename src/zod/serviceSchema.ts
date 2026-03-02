import { z } from "zod";

export const servicePackageSchema = z.object({
  name: z.enum(["Basic", "Standard", "Premium"]),
  price: z.number().min(1, "Price must be greater than 0"),
  description: z.string().min(1, "Package description is required"),
});

export const serviceSchema = z.object({
  name: z.string()
    .min(1, "Service name is required")
    .regex(/^[a-zA-Z\s]+$/, "Service name must contain only letters"),
  category: z.string().min(1, "Category is required"),
  description: z.string()
    .min(1, "Description is required")
    .refine((val) => {
      const words = val.trim().split(/\s+/).filter(Boolean);
      return words.length >= 2 && words.length <= 3;
    }, "Description must be 2 to 3 words"),
  duration: z.string().min(1, "Duration is required").refine((val) => {
    const match = val.match(/(\d+)h\s*(\d+)m/);
    if (!match) return false;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    return h > 0 || m > 0;
  }, "Duration must be greater than 0"),
  basePrice: z.number().default(0),
  customPrice: z.boolean().default(false),
  visitType: z.enum(["Home Visit", "Temple Visit", "Both"]),
  requiredItems: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
  packages: z.array(servicePackageSchema).optional(),
});

export const step1Schema = serviceSchema.pick({
  name: true,
  category: true,
  description: true,
  duration: true,
  visitType: true,
  customPrice: true,
});

export const step2Schema = z.object({
  packages: z.array(servicePackageSchema),
});

export const step3Schema = serviceSchema.pick({
  enabled: true,
});
