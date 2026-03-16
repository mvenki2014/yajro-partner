import { z } from "zod";

export const servicePackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  description: z.string().min(1, "Package description is required"),
});

export const serviceSchema = z.object({
  name: z.string()
    .min(1, "Service name is required")
    .regex(/^[a-zA-Z\s]+$/, "Service name must contain only letters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().refine((val) => {
    const words = val.trim().split(/\s+/).filter(Boolean);
    return words.length >= 2;
  }, "Description must be at least 2 words"),
  duration: z.string().min(1, "Duration is required").refine((val) => {
    const match = val.match(/^(\d+)h\s*(\d+)m$/);
    if (!match) return false;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    return h > 0 || m > 0;
  }, "Duration must be greater than 0"),
  basePrice: z.number().min(0, "Base price cannot be negative").default(0),
  customPrice: z.boolean().default(true),
  visitType: z.enum(["Home Visit", "Temple Visit", "Both"]),
  requiredItems: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
  image: z.string().optional(),
  packages: z.array(servicePackageSchema).optional(),
  adminPackages: z.array(servicePackageSchema).optional(),
});

export const step1Schema = serviceSchema.pick({
  name: true,
  category: true,
  description: true,
});

export const step2Schema = serviceSchema.pick({
  duration: true,
  visitType: true,
  customPrice: true,
  image: true,
  adminPackages: true,
}).extend({
  basePrice: z.number().min(1, "Enter your starting price"),
}).superRefine((data, ctx) => {
  const basicPackage = data.adminPackages?.find((pkg) => pkg.name.toLowerCase() === "basic");
  if (basicPackage && data.basePrice > basicPackage.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["basePrice"],
      message: "Min/starting price cannot be greater than admin basic price",
    });
  }
});

export const step3Schema = serviceSchema.pick({
  enabled: true,
});
