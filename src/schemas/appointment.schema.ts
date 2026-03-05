import * as z from "zod";
import { isValidPHPhone } from "@/lib/utils";

export const appointmentSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z
    .string()
    .trim()
    .min(1, "Customer phone is required")
    .refine(isValidPHPhone, "Phone number must start with 09 and be 11 digits long"),
  branchId: z.string().min(1, "Branch is required"),
  startDateTime: z.date({ message: "Start time is required" }),
  endDateTime: z.date().optional(),
  isWalkin: z.boolean(),
  serviceIds: z.array(z.string()).min(1, "At least one service is required"),
  selectedReminderIds: z.array(z.string()).optional(),
  notes: z.string().trim().optional(),
  reminderLeadTimeHours: z.string().optional(),
  reminderLeadTimeMinutes: z.string().optional(),
  additionalReminderMinutes: z.number().optional(),
  customReminderEnabled: z.boolean().optional(),
  additionalReminderTemplate: z.string().trim().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"]).optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
