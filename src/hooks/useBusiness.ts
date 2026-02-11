import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { type CreateBusinessRequest } from "@/types/business";
import { Q_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessRequest) =>
      businessService.createBusiness(data),
    onSuccess: () => {
      toast.success("Business created successfully");
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.BUSINESSES] });
    },
    onError: (error) => {
      console.error("Error creating business:", error);
      toast.error("Failed to create business");
    },
  });
};
