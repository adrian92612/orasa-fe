import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";

import type {
  CreateStaffRequest,
  StaffResponse,
  UpdateStaffRequest,
} from "@/types/staff";

export const staffService = {
  getAll: async (): Promise<StaffResponse[]> => {
    const response = await apiClient.get<StaffResponse[]>(
      API_ROUTES.STAFF.BASE,
    );
    return response.data || [];
  },

  getById: async (id: string): Promise<StaffResponse> => {
    const response = await apiClient.get<StaffResponse>(
      API_ROUTES.STAFF.BY_ID(id),
    );
    return response.data!;
  },

  create: async (data: CreateStaffRequest): Promise<StaffResponse> => {
    const response = await apiClient.post<StaffResponse>(
      API_ROUTES.STAFF.CREATE,
      data,
    );
    return response.data!;
  },

  update: async (
    id: string,
    data: UpdateStaffRequest,
  ): Promise<StaffResponse> => {
    const response = await apiClient.put<StaffResponse>(
      API_ROUTES.STAFF.BY_ID(id),
      data,
    );
    return response.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ROUTES.STAFF.BY_ID(id));
  },
};
