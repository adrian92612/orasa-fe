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
