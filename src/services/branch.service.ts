import type { ApiResponse } from "@/lib/api-client";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type {
  BranchResponse,
  CreateBranchRequest,
  UpdateBranchRequest,
} from "@/types/branch";
import type {
  AssignServiceToBranchRequest,
  BranchServiceResponse,
  UpdateBranchServiceRequest,
} from "@/types/service";

export const branchService = {
  updateBranch: async (
    id: string,
    data: UpdateBranchRequest,
  ): Promise<ApiResponse<BranchResponse>> => {
    return apiClient.put<BranchResponse>(API_ROUTES.BRANCHES.BY_ID(id), data);
  },

  createBranch: async (
    data: CreateBranchRequest,
  ): Promise<ApiResponse<BranchResponse>> => {
    return apiClient.post<BranchResponse>(API_ROUTES.BRANCHES.BASE, data);
  },

  getAllBranches: async (): Promise<ApiResponse<BranchResponse[]>> => {
    return apiClient.get<BranchResponse[]>(API_ROUTES.BRANCHES.BASE);
  },

  getBranchById: async (id: string): Promise<ApiResponse<BranchResponse>> => {
    return apiClient.get<BranchResponse>(API_ROUTES.BRANCHES.BY_ID(id));
  },

  getServices: async (
    branchId: string,
  ): Promise<ApiResponse<BranchServiceResponse[]>> => {
    return apiClient.get<BranchServiceResponse[]>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
    );
  },

  assignService: async (
    branchId: string,
    data: AssignServiceToBranchRequest,
  ): Promise<ApiResponse<BranchServiceResponse>> => {
    return apiClient.post<BranchServiceResponse>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
      data,
    );
  },

  deleteBranch: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ROUTES.BRANCHES.BY_ID(id));
  },

  updateService: async (
    branchId: string,
    serviceLinkId: string,
    data: UpdateBranchServiceRequest,
  ): Promise<ApiResponse<BranchServiceResponse>> => {
    return apiClient.put<BranchServiceResponse>(
      API_ROUTES.BRANCHES.SERVICES.BY_ID(branchId, serviceLinkId),
      data,
    );
  },

  removeService: async (
    branchId: string,
    serviceLinkId: string,
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(
      API_ROUTES.BRANCHES.SERVICES.BY_ID(branchId, serviceLinkId),
    );
  },
};
