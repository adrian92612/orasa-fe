import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import { type ChangePasswordRequest } from "@/types/auth";

export const authService = {
  changePassword: async (data: ChangePasswordRequest) => {
    return await apiClient.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
  },
};
