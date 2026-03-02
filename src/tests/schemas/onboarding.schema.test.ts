import { describe, expect, it } from "vitest";
import { businessOnboardingSchema, staffOnboardingSchema, serviceOnboardingSchema } from "@/schemas/onboarding.schema";

describe("Onboarding Validation Schemas", () => {
  describe("BusinessOnboardingSchema", () => {
    it("should successfully validate correct business/branch payload", () => {
      const result = businessOnboardingSchema.safeParse({
        businessName: "Test Clinic",
        branchName: "Main Branch",
        branchAddress: "123 Main St.",
        branchPhone: "09123456789",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      const result = businessOnboardingSchema.safeParse({
        businessName: "Test Clinic",
        branchName: "Main Branch",
        branchAddress: "123 Main St.",
        branchPhone: "123456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Phone number must start with 09 and be 11 digits long");
      }
    });

    it("should reject empty strings where required", () => {
      const result = businessOnboardingSchema.safeParse({
        businessName: "   ",
        branchName: "Main Branch",
        branchAddress: "123 Main St.",
        branchPhone: "09123456789",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("StaffOnboardingSchema", () => {
    it("should successfully validate matching passwords", () => {
      const result = staffOnboardingSchema.safeParse({
        username: "johndoe",
        temporaryPassword: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject non-matching passwords", () => {
      const result = staffOnboardingSchema.safeParse({
        username: "johndoe",
        temporaryPassword: "password123",
        confirmPassword: "password456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });

    it("should reject usernames that are too short", () => {
      const result = staffOnboardingSchema.safeParse({
        username: "jo",
        temporaryPassword: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Username must be at least 3 characters");
      }
    });
  });

  describe("ServiceOnboardingSchema", () => {
    it("should validate a standard service payload", () => {
      const result = serviceOnboardingSchema.safeParse({
        name: "Basic Haircut",
        description: "Standard cut",
        basePrice: 500,
        durationMinutes: 30,
      });
      expect(result.success).toBe(true);
    });

    it("should coerce number strings successfully", () => {
      const result = serviceOnboardingSchema.safeParse({
        name: "Basic Haircut",
        basePrice: "500", // Testing coerce numeric
        durationMinutes: "30",
      });
      expect(result.success).toBe(true);
    });

    it("should reject duration smaller than 1", () => {
      const result = serviceOnboardingSchema.safeParse({
        name: "Basic Haircut",
        basePrice: 500,
        durationMinutes: 0.5,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Duration must be at least 1 minute");
      }
    });
  });
});
