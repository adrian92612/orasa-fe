import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { BusinessResponse } from "@/types/business";
import type { Page } from "@/types/common";
import type { ApiResponse } from "@/lib/api-client";

import { Q_KEYS } from "@/constants/queryKeys";

export const useAdminBusinesses = (params: {
  query?: string;
  status?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: [
      Q_KEYS.ADMIN_BUSINESSES,
      params.query,
      params.status,
      params.page,
      params.size,
    ],
    queryFn: () => adminService.getAllBusinesses(params),
    select: (data) => data.data,
  });
};

export const useActivateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) =>
      adminService.activateSubscription(businessId),
    onMutate: async (businessId) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      const previousBusinesses = queryClient.getQueriesData<
        ApiResponse<Page<BusinessResponse>>
      >({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      queryClient.setQueriesData<ApiResponse<Page<BusinessResponse>>>(
        { queryKey: [Q_KEYS.ADMIN_BUSINESSES] },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              content: old.data.content.map((business) =>
                business.id === businessId
                  ? { ...business, subscriptionStatus: "ACTIVE" }
                  : business,
              ),
            },
          };
        },
      );

      return { previousBusinesses };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to activate subscription");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Subscription activated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });
    },
  });
};

export const useExtendSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      months,
    }: {
      businessId: string;
      months: number;
    }) => adminService.extendSubscription(businessId, months),
    onMutate: async ({ businessId, months }) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      const previousBusinesses = queryClient.getQueriesData<
        ApiResponse<Page<BusinessResponse>>
      >({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      queryClient.setQueriesData<ApiResponse<Page<BusinessResponse>>>(
        { queryKey: [Q_KEYS.ADMIN_BUSINESSES] },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              content: old.data.content.map((business) => {
                if (business.id !== businessId) return business;

                const now = new Date();
                const currentEndDate = business.subscriptionEndDate
                  ? new Date(business.subscriptionEndDate)
                  : now;

                const isActive = business.subscriptionStatus === "ACTIVE";
                const isFuture =
                  !isNaN(currentEndDate.getTime()) && currentEndDate > now;

                const baseDate = isActive && isFuture ? currentEndDate : now;

                const newEndDate = new Date(baseDate);
                newEndDate.setMonth(newEndDate.getMonth() + months);

                return {
                  ...business,
                  subscriptionStatus: "ACTIVE",
                  subscriptionEndDate: newEndDate.toISOString(),
                };
              }),
            },
          };
        },
      );

      return { previousBusinesses };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to extend subscription");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Subscription extended");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) =>
      adminService.cancelSubscription(businessId),
    onMutate: async (businessId) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      const previousBusinesses = queryClient.getQueriesData<
        ApiResponse<Page<BusinessResponse>>
      >({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      queryClient.setQueriesData<ApiResponse<Page<BusinessResponse>>>(
        { queryKey: [Q_KEYS.ADMIN_BUSINESSES] },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              content: old.data.content.map((business) =>
                business.id === businessId
                  ? { ...business, subscriptionStatus: "CANCELLED" }
                  : business,
              ),
            },
          };
        },
      );

      return { previousBusinesses };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to cancel subscription");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Subscription cancelled");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });
    },
  });
};

export const useAddCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      credits,
    }: {
      businessId: string;
      credits: number;
    }) => adminService.addCredits(businessId, credits),
    onMutate: async ({ businessId, credits }) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      const previousBusinesses = queryClient.getQueriesData<
        ApiResponse<Page<BusinessResponse>>
      >({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });

      queryClient.setQueriesData<ApiResponse<Page<BusinessResponse>>>(
        { queryKey: [Q_KEYS.ADMIN_BUSINESSES] },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              content: old.data.content.map((business) =>
                business.id === businessId
                  ? {
                      ...business,
                      paidSmsCredits: business.paidSmsCredits + credits,
                    }
                  : business,
              ),
            },
          };
        },
      );

      return { previousBusinesses };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBusinesses) {
        context.previousBusinesses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to add credits");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Credits added successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.ADMIN_BUSINESSES] });
    },
  });
};
