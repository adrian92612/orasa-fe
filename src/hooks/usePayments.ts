import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import { Q_KEYS } from "@/constants/queryKeys";

export const usePaymentMutations = () => {
  const createSubscriptionPayment = useMutation({
    mutationFn: paymentService.createSubscriptionPayment,
    onSuccess: (response) => {
      if (response.message) {
        toast.success(response.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate subscription payment");
    },
  });

  const createCreditsPayment = useMutation({
    mutationFn: paymentService.createCreditsPayment,
    onSuccess: (response) => {
      if (response.message) {
        toast.success(response.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate credits payment");
    },
  });

  return {
    createSubscriptionPayment,
    createCreditsPayment,
  };
};

export const usePaymentHistory = () => {
  return useQuery({
    queryKey: [Q_KEYS.PAYMENTS, "history"],
    queryFn: async () => {
      const response = await paymentService.getPaymentHistory();
      return response.data || [];
    },
  });
};
