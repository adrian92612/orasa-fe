import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import {
  type BusinessResponse,
  type CreateBusinessRequest,
} from "@/types/business";

export const businessService = {
  createBusiness: async (
    data: CreateBusinessRequest,
  ): Promise<ApiResponse<BusinessResponse>> => {
    const response = await apiClient.post<BusinessResponse>(
      API_ROUTES.BUSINESSES.CREATE,
      data,
    );
    return response;
  },

  getMyBusiness: async () => {
    const response = await apiClient.get<BusinessResponse>(
      API_ROUTES.BUSINESSES.ME,
    );
    return response.data!;
  },
};
