import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type {
  PayloroResponse,
  CreateSubscriptionPaymentRequest,
  CreateCreditsPaymentRequest,
} from "@/types/payment";

export const paymentService = {
  createSubscriptionPayment: async (
    request: CreateSubscriptionPaymentRequest,
  ): Promise<ApiResponse<PayloroResponse>> => {
    return await apiClient.post<PayloroResponse>(
      API_ROUTES.PAYMENTS.SUBSCRIPTION,
      request,
    );
  },

  createCreditsPayment: async (
    request: CreateCreditsPaymentRequest,
  ): Promise<ApiResponse<PayloroResponse>> => {
    return await apiClient.post<PayloroResponse>(
      API_ROUTES.PAYMENTS.CREDITS,
      request,
    );
  },
};
