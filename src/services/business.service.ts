import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import {
  type BusinessResponse,
  type CreateBusinessRequest,
} from "@/types/business";

export const businessService = {
  createBusiness: async (data: CreateBusinessRequest) => {
    const response = await apiClient.post<BusinessResponse>(
      API_ROUTES.BUSINESSES.CREATE,
      data,
    );
    return response.data!;
  },
};
