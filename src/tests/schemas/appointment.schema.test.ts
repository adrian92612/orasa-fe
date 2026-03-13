import { describe, expect, it } from "vitest";
import { appointmentSchema } from "@/schemas/appointment.schema";

describe("Appointment Zod Schema", () => {
  const validBaseAppointment = {
    customerName: "Jane Doe",
    customerPhone: "09123456789",
    branchId: "branch-1",
    startDateTime: new Date("2024-01-01T10:00:00"),
    isWalkin: false,
    serviceIds: ["srv-1"],
    remindersEnabled: true,
  };

  it("should validate a completely valid appointment", () => {
    const result = appointmentSchema.safeParse(validBaseAppointment);
    expect(result.success).toBe(true);
  });

  describe("Customer Information", () => {
    it("should reject empty customer names", () => {
      const result = appointmentSchema.safeParse({ ...validBaseAppointment, customerName: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Customer name is required");
      }
    });

    it("should reject invalid phone numbers", () => {
      const invalidPhones = ["12345678901", "08123456789", "091234567", "091234567890"];
      invalidPhones.forEach((phone) => {
        const result = appointmentSchema.safeParse({ ...validBaseAppointment, customerPhone: phone });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Phone number must start with 09 and be 11 digits long");
        }
      });
    });

    it("should reject empty phone numbers", () => {
      const result = appointmentSchema.safeParse({ ...validBaseAppointment, customerPhone: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Customer phone is required");
      }
    });
  });

  describe("Scheduling Information", () => {
    it("should require a branch ID", () => {
      const result = appointmentSchema.safeParse({ ...validBaseAppointment, branchId: "" });
      expect(result.success).toBe(false);
    });

    it("should require at least one service", () => {
      const result = appointmentSchema.safeParse({ ...validBaseAppointment, serviceIds: [] });
      expect(result.success).toBe(false);
    });

    it("should require a startDateTime", () => {
      const result = appointmentSchema.safeParse({ ...validBaseAppointment, startDateTime: undefined });
      expect(result.success).toBe(false);
    });
  });

  describe("Optional Fields", () => {
    it("should allow optional fields to be present", () => {
      const withOptionals = {
        ...validBaseAppointment,
        notes: "Some notes right here",
        customReminderEnabled: true,
        additionalReminderMinutes: 60,
        additionalReminderTemplate: "Hello",
        status: "CONFIRMED",
      };
      const result = appointmentSchema.safeParse(withOptionals);
      expect(result.success).toBe(true);
    });
  });
});
