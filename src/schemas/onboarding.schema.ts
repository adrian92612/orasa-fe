import { z } from "zod";
import { isValidPHPhone } from "@/lib/utils";

export const businessOnboardingSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required"),
  branchName: z.string().trim().min(1, "Branch name is required"),
  branchAddress: z.string().trim().min(1, "Branch address is required"),
  branchPhone: z
    .string()
    .trim()
    .min(1, "Branch phone number is required")
    .refine(isValidPHPhone, "Phone number must start with 09 and be 11 digits long"),
});

export type BusinessOnboardingValues = z.infer<typeof businessOnboardingSchema>;

export const staffOnboardingSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    temporaryPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.temporaryPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StaffOnboardingValues = z.infer<typeof staffOnboardingSchema>;

export const serviceOnboardingSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  basePrice: z.coerce.number().min(1, "Price must be at least 1"),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
});

export type ServiceOnboardingValues = z.infer<typeof serviceOnboardingSchema>;
