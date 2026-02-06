export type BusinessResponse = {
  id: string;
  name: string;
  slug: string;
  freeSmsCredits: number;
  paidSmsCredits: number;
  subscriptionStatus: string;
  createdAt: string;
  firstBranchId: string;
};

export type CreateBusinessRequest = {
  name: string;
  branch: {
    name: string;
    address: string;
    phoneNumber: string;
  };
};
