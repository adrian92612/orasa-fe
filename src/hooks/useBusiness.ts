import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { type CreateBusinessRequest } from "@/types/business";
import { Q_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export const useMyBusiness = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: [Q_KEYS.BUSINESSES, Q_KEYS.ME],
    queryFn: () => businessService.getMyBusiness(),
    enabled: !!user?.businessId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuspenseMyBusiness = () => {
  return useSuspenseQuery({
    queryKey: [Q_KEYS.BUSINESSES, Q_KEYS.ME],
    queryFn: () => businessService.getMyBusiness(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessRequest) =>
      businessService.createBusiness(data),
    onSuccess: (response) => {
      toast.success(response.message || "Business created successfully");
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BUSINESSES] });
    },
    onError: (error) => {
      console.error("Error creating business:", error);
      toast.error("Failed to create business");
    },
  });
};
