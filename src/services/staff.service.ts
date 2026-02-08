import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import type { StaffResponse } from "@/types/staff";

export const staffService = {
  getAllStaff: async () => {
    return apiClient.get<StaffResponse[]>(API_ROUTES.STAFF.BASE);
  },
};
