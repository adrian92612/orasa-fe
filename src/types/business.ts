export type BusinessResponse = {
  id: string;
  name: string;
  slug: string;
  freeSmsCredits: number;
  paidSmsCredits: number;
  subscriptionStatus: "ACTIVE" | "EXPIRED" | "PENDING" | "CANCELLED";
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  nextCreditResetDate?: string;
  createdAt: string;
  firstBranchId: string;
};

export type CreateBusinessRequest = {
  name: string;
  termsAcceptedAt: string;
  branch: {
    name: string;
    address: string;
    phoneNumber: string;
  };
};
