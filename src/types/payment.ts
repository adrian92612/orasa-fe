export type PayloroResponse = {
  success: boolean;
  paymentLink: string | null;
  paymentImage: string | null;
  platOrderNo: string | null;
  errorMessage: string | null;
};

export type CreateSubscriptionPaymentRequest = {
  months: number;
};

export type CreateCreditsPaymentRequest = {
  credits: number;
  method: string;
};

export type PaymentStatusUpdate = {
  merchantOrderNo: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
  type: "SUBSCRIPTION_RENEWAL" | "CREDIT_TOPUP";
};

export type PaymentHistoryResponse = {
  id: string;
  merchantOrderNo: string;
  platOrderNo: string | null;
  amount: number;
  description: string;
  method: string;
  type: "SUBSCRIPTION_RENEWAL" | "CREDIT_TOPUP";
  status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
  createdAt: string;
};
