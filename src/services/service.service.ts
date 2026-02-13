import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type {
  CreateServiceRequest,
  ServiceResponse,
  UpdateServiceRequest,
} from "@/types/service";

export const serviceService = {
  getAllServices: async (branchId?: string | null) => {
    let url = API_ROUTES.SERVICES.BASE;
    if (branchId) {
      url += `?branchId=${branchId}`;
    }
    const response = await apiClient.get<ServiceResponse[]>(url);
    return response.data;
  },

  getServiceById: async (id: string) => {
    const response = await apiClient.get<ServiceResponse>(
      API_ROUTES.SERVICES.BY_ID(id),
    );
    return response.data;
  },

  createService: async (
    data: CreateServiceRequest,
  ): Promise<ApiResponse<ServiceResponse>> => {
    const response = await apiClient.post<ServiceResponse>(
      API_ROUTES.SERVICES.CREATE,
      data,
    );
    return response;
  },

  updateService: async (
    id: string,
    data: UpdateServiceRequest,
  ): Promise<ApiResponse<ServiceResponse>> => {
    const response = await apiClient.put<ServiceResponse>(
      API_ROUTES.SERVICES.BY_ID(id),
      data,
    );
    return response;
  },

  deleteService: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete(API_ROUTES.SERVICES.BY_ID(id));
  },
};
