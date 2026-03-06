import { apiClient, type ApiResponse } from "@/lib/api-client";
import { API_ROUTES } from "@/constants/routes";
import type {
  PayloroResponse,
  CreateSubscriptionPaymentRequest,
  CreateCreditsPaymentRequest,
  PaymentHistoryResponse,
  PaymentStatusUpdate,
} from "@/types/payment";

export const paymentService = {
  createSubscriptionPayment: async (
    request: CreateSubscriptionPaymentRequest,
  ): Promise<ApiResponse<PayloroResponse>> => {
    return await apiClient.post<PayloroResponse>(API_ROUTES.PAYMENTS.SUBSCRIPTION, request);
  },

  createCreditsPayment: async (request: CreateCreditsPaymentRequest): Promise<ApiResponse<PayloroResponse>> => {
    return await apiClient.post<PayloroResponse>(API_ROUTES.PAYMENTS.CREDITS, request);
  },

  getPaymentHistory: async (): Promise<ApiResponse<PaymentHistoryResponse[]>> => {
    return await apiClient.get<PaymentHistoryResponse[]>(`${API_ROUTES.PAYMENTS.BASE}/history`);
  },

  checkPaymentStatus: async (platOrderNo: string): Promise<ApiResponse<PaymentStatusUpdate>> => {
    return await apiClient.get<PaymentStatusUpdate>(`${API_ROUTES.PAYMENTS.STATUS}?platOrderNo=${platOrderNo}`);
  },
};
