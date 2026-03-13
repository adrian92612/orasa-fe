import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type {
  BranchResponse,
  CreateBranchRequest,
  UpdateBranchRequest,
} from "@/types/branch";
import type { ServiceResponse } from "@/types/service";

export const branchService = {
  updateBranch: async (
    id: string,
    data: UpdateBranchRequest,
  ): Promise<ApiResponse<BranchResponse>> => {
    const response = await apiClient.put<BranchResponse>(
      API_ROUTES.BRANCHES.BY_ID(id),
      data,
    );
    return response;
  },

  createBranch: async (
    data: CreateBranchRequest,
  ): Promise<ApiResponse<BranchResponse>> => {
    const response = await apiClient.post<BranchResponse>(
      API_ROUTES.BRANCHES.BASE,
      data,
    );
    return response;
  },

  getAllBranches: async (): Promise<BranchResponse[]> => {
    const response = await apiClient.get<BranchResponse[]>(
      API_ROUTES.BRANCHES.BASE,
    );
    return response.data || [];
  },

  getBranchById: async (id: string): Promise<BranchResponse> => {
    const response = await apiClient.get<BranchResponse>(
      API_ROUTES.BRANCHES.BY_ID(id),
    );
    return response.data!;
  },

  getServices: async (branchId: string): Promise<ServiceResponse[]> => {
    const response = await apiClient.get<ServiceResponse[]>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
    );
    return response.data || [];
  },

  assignService: async (
    branchId: string,
    data: { serviceId: string },
  ): Promise<ApiResponse<ServiceResponse>> => {
    const response = await apiClient.post<ServiceResponse>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
      data,
    );
    return response;
  },

  deleteBranch: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(API_ROUTES.BRANCHES.BY_ID(id));
  },

  // Placeholder for update service on branch if needed in future
  // For now, it's just a simple link/unlink or covered by global service update

  removeService: async (
    branchId: string,
    serviceLinkId: string,
  ): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(
      API_ROUTES.BRANCHES.SERVICES.BY_ID(branchId, serviceLinkId),
    );
  },
};
