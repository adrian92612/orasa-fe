import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
} from "@/types/service";
import type { BranchResponse } from "@/types/branch";
import { Q_KEYS } from "@/constants/queryKeys";

export const useServices = (branchId?: string | null) => {
  return useQuery({
    queryKey: [Q_KEYS.SERVICES, { branchId }],
    queryFn: () => serviceService.getAllServices(branchId),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) =>
      serviceService.createService(data),
    onSuccess: (newService) => {
      if (newService) {
        queryClient.setQueryData<ServiceResponse[]>(
          [Q_KEYS.SERVICES],
          (old = []) => [...old, newService],
        );

        if (newService.availableGlobally) {
          queryClient.setQueryData<BranchResponse[]>(
            [Q_KEYS.BRANCHES],
            (old = []) =>
              old.map((branch) => ({
                ...branch,
                activeServiceIds: [...branch.activeServiceIds, newService.id],
                serviceCount: branch.serviceCount + 1,
              })),
          );
        }
      }
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      serviceService.updateService(id, data),
    onSuccess: (updatedService) => {
      if (updatedService) {
        queryClient.setQueryData<ServiceResponse[]>(
          [Q_KEYS.SERVICES],
          (old = []) =>
            old.map((s) => (s.id === updatedService.id ? updatedService : s)),
        );

        if (updatedService.availableGlobally) {
          queryClient.setQueryData<BranchResponse[]>(
            [Q_KEYS.BRANCHES],
            (old = []) =>
              old.map((branch) => {
                if (branch.activeServiceIds.includes(updatedService.id)) {
                  return branch;
                }
                return {
                  ...branch,
                  activeServiceIds: [
                    ...branch.activeServiceIds,
                    updatedService.id,
                  ],
                  serviceCount: branch.serviceCount + 1,
                };
              }),
          );
        }
      }
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceService.deleteService(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ServiceResponse[]>(
        [Q_KEYS.SERVICES],
        (old = []) => old.filter((s) => s.id !== deletedId),
      );
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BRANCHES] });
    },
  });
};
