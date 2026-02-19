import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";

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
