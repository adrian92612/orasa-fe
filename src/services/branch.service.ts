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
  ): Promise<BranchResponse> => {
    const response = await apiClient.put<BranchResponse>(
      API_ROUTES.BRANCHES.BY_ID(id),
      data,
    );
    return response.data!;
  },

  createBranch: async (data: CreateBranchRequest): Promise<BranchResponse> => {
    const response = await apiClient.post<BranchResponse>(
      API_ROUTES.BRANCHES.BASE,
      data,
    );
    return response.data!;
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

  getServices: async (branchId: string): Promise<BranchServiceResponse[]> => {
    const response = await apiClient.get<BranchServiceResponse[]>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
    );
    return response.data || [];
  },

  assignService: async (
    branchId: string,
    data: AssignServiceToBranchRequest,
  ): Promise<BranchServiceResponse> => {
    const response = await apiClient.post<BranchServiceResponse>(
      API_ROUTES.BRANCHES.SERVICES.BASE(branchId),
      data,
    );
    return response.data!;
  },

  deleteBranch: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ROUTES.BRANCHES.BY_ID(id));
  },

  updateService: async (
    branchId: string,
    serviceLinkId: string,
    data: UpdateBranchServiceRequest,
  ): Promise<BranchServiceResponse> => {
    const response = await apiClient.put<BranchServiceResponse>(
      API_ROUTES.BRANCHES.SERVICES.BY_ID(branchId, serviceLinkId),
      data,
    );
    return response.data!;
  },

  removeService: async (
    branchId: string,
    serviceLinkId: string,
  ): Promise<void> => {
    await apiClient.delete<void>(
      API_ROUTES.BRANCHES.SERVICES.BY_ID(branchId, serviceLinkId),
    );
  },
};
