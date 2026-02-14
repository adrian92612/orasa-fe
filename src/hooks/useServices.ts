import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { serviceService } from "@/services/service.service";
import { branchService } from "@/services/branch.service";
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
  BranchServiceResponse,
  AssignServiceToBranchRequest,
  UpdateBranchServiceRequest,
} from "@/types/service";
import { Q_KEYS } from "@/constants/queryKeys";

export const useServices = (branchId?: string | null) => {
  return useQuery({
    queryKey: [Q_KEYS.SERVICES, { branchId }],
    queryFn: () => serviceService.getAllServices(branchId),
  });
};

export const useSuspenseServices = (branchId?: string | null) => {
  return useSuspenseQuery({
    queryKey: [Q_KEYS.SERVICES, { branchId }],
    queryFn: () => serviceService.getAllServices(branchId),
  });
};

export const useBranchServices = (branchId: string | null) => {
  return useQuery({
    queryKey: [Q_KEYS.SERVICES, "branch", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      return branchService.getServices(branchId);
    },
    enabled: !!branchId,
  });
};

export const useSuspenseBranchServices = (branchId: string | null) => {
  return useSuspenseQuery({
    queryKey: [Q_KEYS.SERVICES, "branch", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      return branchService.getServices(branchId);
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) =>
      serviceService.createService(data),
    onMutate: async (newServiceData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.SERVICES, { branchId: null }],
      });

      // Snapshot the previous value
      const previousServices = queryClient.getQueryData<ServiceResponse[]>([
        Q_KEYS.SERVICES,
        { branchId: null },
      ]);

      // Optimistically update to the new value
      if (previousServices) {
        queryClient.setQueryData<ServiceResponse[]>(
          [Q_KEYS.SERVICES, { branchId: null }],
          (old = []) => [
            ...old,
            {
              id: crypto.randomUUID(), // Temp ID
              businessId: "temp-business-id",
              name: newServiceData.name,
              description: newServiceData.description,
              basePrice: newServiceData.basePrice,
              durationMinutes: newServiceData.durationMinutes,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isOptimistic: true, // Mark as optimistic
            },
          ],
        );

        // Also update ALL branch service lists because backend auto-assigns to all branches
        const branchQueries = queryClient.getQueriesData<
          BranchServiceResponse[]
        >({
          queryKey: [Q_KEYS.SERVICES, "branch"],
        });

        branchQueries.forEach(([queryKey, oldData]) => {
          if (oldData) {
            queryClient.setQueryData(queryKey, [
              ...oldData,
              {
                id: crypto.randomUUID(),
                branchId: queryKey[2] as string, // Extract branchId from key
                serviceId: "temp-id-placeholder", // We don't have the real ID yet. ServiceList needs 'id' (linkId) and 'serviceId'.
                // NOTE: We should disable interactions on these items in the UI.
                serviceName: newServiceData.name,
                serviceDescription: newServiceData.description,
                basePrice: newServiceData.basePrice,
                effectivePrice: newServiceData.basePrice,
                durationMinutes: newServiceData.durationMinutes,
                active: true,
                createdAt: new Date().toISOString(),
                // BranchServiceResponse doesn't have isOptimistic in its type, we might need to cast or add it there too?
                // But ServiceList uses ServiceResponse mapped from BranchServiceResponse.
                // In ServicesPage.tsx, we map BranchServiceResponse to ServiceResponse.
                // We should add isOptimistic to BranchServiceResponse too or handle mapping.
                isOptimistic: true,
              },
            ]);
          }
        });
      }

      return { previousServices };
    },
    onError: (_err, _newService, context) => {
      // Rollback to the previous value
      if (context?.previousServices) {
        queryClient.setQueryData(
          [Q_KEYS.SERVICES, { branchId: null }],
          context.previousServices,
        );
      }
      toast.error("Failed to create service");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Service created successfully");
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.SERVICES, "branch"],
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      serviceService.updateService(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.SERVICES, { branchId: null }],
      });

      const previousServices = queryClient.getQueryData<ServiceResponse[]>([
        Q_KEYS.SERVICES,
        { branchId: null },
      ]);

      if (previousServices) {
        queryClient.setQueryData<ServiceResponse[]>(
          [Q_KEYS.SERVICES, { branchId: null }],
          (old = []) =>
            old.map((s) =>
              s.id === id
                ? {
                    ...s,
                    ...data,
                    updatedAt: new Date().toISOString(),
                    isOptimistic: true,
                  }
                : s,
            ),
        );

        // Also update ALL branch service lists
        const branchQueries = queryClient.getQueriesData<
          BranchServiceResponse[]
        >({
          queryKey: [Q_KEYS.SERVICES, "branch"],
        });

        branchQueries.forEach(([queryKey, oldData]) => {
          if (oldData) {
            queryClient.setQueryData(
              queryKey,
              oldData.map((s) => {
                if (s.serviceId === id) {
                  return {
                    ...s,
                    serviceName: data.name ?? s.serviceName,
                    serviceDescription:
                      data.description ?? s.serviceDescription,
                    basePrice: data.basePrice ?? s.basePrice,

                    // Note: effectivePrice might be custom, but usually resets to base if not overridden?
                    // Or stays same if it was same as base?
                    // For now let's assume effectivePrice follows basePrice if they were equal,
                    // but complicate if custom.
                    // Ideally check if effective == base before update.
                    // But here we can't easily know.
                    // Let's just update basePrice. The UI might show basePrice.
                    durationMinutes: data.durationMinutes ?? s.durationMinutes,
                    isOptimistic: true,
                  };
                }
                return s;
              }),
            );
          }
        });
      }

      return { previousServices };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(
          [Q_KEYS.SERVICES, { branchId: null }],
          context.previousServices,
        );
      }
      toast.error("Failed to update service");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Service updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      // Also invalidate branch services since they might display updated info
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES, "branch"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceService.deleteService(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.SERVICES, { branchId: null }],
      });

      const previousServices = queryClient.getQueryData<ServiceResponse[]>([
        Q_KEYS.SERVICES,
        { branchId: null },
      ]);

      if (previousServices) {
        queryClient.setQueryData<ServiceResponse[]>(
          [Q_KEYS.SERVICES, { branchId: null }],
          (old = []) => old.filter((s) => s.id !== id),
        );
      }

      return { previousServices };
    },
    onError: (_err, _id, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(
          [Q_KEYS.SERVICES, { branchId: null }],
          context.previousServices,
        );
      }
      toast.error("Failed to delete service");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Service deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BRANCHES] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES, "branch"] });
    },
  });
};

export const useAssignServiceToBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: string;
      data: AssignServiceToBranchRequest;
    }) => branchService.assignService(branchId, data),
    onMutate: async ({ branchId, data }) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.SERVICES, "branch", branchId],
      });

      const previousBranchServices = queryClient.getQueryData<
        BranchServiceResponse[]
      >([Q_KEYS.SERVICES, "branch", branchId]);

      // Optimistic update
      queryClient.setQueryData<BranchServiceResponse[]>(
        [Q_KEYS.SERVICES, "branch", branchId],
        (old = []) => {
          // Check if it already exists (shouldn't for assign, but safe to check)
          if (old.some((s) => s.serviceId === data.serviceId)) return old;

          // Fake a new entry
          const optimisticService: BranchServiceResponse = {
            id: crypto.randomUUID(), // Temp ID
            branchId,
            serviceId: data.serviceId,
            serviceName: "Loading...", // We don't have the name here easily unless we look it up, but List view has it.
            // Actually, ServiceList relies on the mapped ActiveServices.
            // If we add to branch services, the ServicesPage logic will pick it up.
            // But ServicesPage logic joins with allServices.
            // So we just need the link to exist.
            basePrice: 0,
            effectivePrice: data.customPrice || 0,
            durationMinutes: 0,
            active: data.active ?? true,
            createdAt: new Date().toISOString(),
          };
          return [...old, optimisticService];
        },
      );

      return { previousBranchServices };
    },
    onError: (_err, { branchId }, context) => {
      if (context?.previousBranchServices) {
        queryClient.setQueryData(
          [Q_KEYS.SERVICES, "branch", branchId],
          context.previousBranchServices,
        );
      }
      toast.error("Failed to assign service");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Service updated");
    },
    onSettled: (_data, _error, { branchId }) => {
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.SERVICES, "branch", branchId],
      });
    },
  });
};

export const useUpdateServiceLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      branchId,
      linkId,
      data,
    }: {
      branchId: string;
      linkId: string;
      data: UpdateBranchServiceRequest;
    }) => branchService.updateService(branchId, linkId, data),
    onMutate: async ({ branchId, linkId, data }) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.SERVICES, "branch", branchId],
      });

      const previousBranchServices = queryClient.getQueryData<
        BranchServiceResponse[]
      >([Q_KEYS.SERVICES, "branch", branchId]);

      // Optimistic update
      queryClient.setQueryData<BranchServiceResponse[]>(
        [Q_KEYS.SERVICES, "branch", branchId],
        (old = []) =>
          old.map((s) =>
            s.id === linkId
              ? {
                  ...s,
                  active: data.active ?? s.active,
                  customPrice: data.customPrice ?? s.customPrice,
                  effectivePrice: data.customPrice ?? s.effectivePrice,
                }
              : s,
          ),
      );

      return { previousBranchServices };
    },
    onError: (_err, { branchId }, context) => {
      if (context?.previousBranchServices) {
        queryClient.setQueryData(
          [Q_KEYS.SERVICES, "branch", branchId],
          context.previousBranchServices,
        );
      }
      toast.error("Failed to update service status");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Service status updated");
    },
    onSettled: (_data, _error, { branchId }) => {
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.SERVICES, "branch", branchId],
      });
    },
  });
};
