import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { serviceService } from "@/services/service.service";
import type {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
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

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) =>
      serviceService.createService(data),
    onMutate: async (newServiceData) => {
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
          (old = []) => [
            ...old,
            {
              id: crypto.randomUUID(), // Temp ID
              businessId: "temp-business-id",
              name: newServiceData.name,
              description: newServiceData.description,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        );
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
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BRANCHES] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.SERVICES],
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
                  }
                : s,
            ),
        );
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
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BRANCHES] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [Q_KEYS.SERVICES],
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
    },
  });
};

