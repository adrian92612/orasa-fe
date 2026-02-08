import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type { ServiceResponse } from "@/types/service";

export const serviceService = {
  getServices: async (): Promise<ApiResponse<ServiceResponse[]>> => {
    return apiClient.get<ServiceResponse[]>(API_ROUTES.SERVICES.BASE);
  },
};
