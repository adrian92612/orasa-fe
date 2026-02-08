export type BranchResponse = {
  id: string;
  businessId: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  staffIds: string[];
  serviceCount: number;
  activeServiceIds: string[];
};

export type CreateBranchRequest = {
  name: string;
  address?: string;
  phoneNumber?: string;
  staffIds?: string[];
  serviceIds?: string[];
};

export type UpdateBranchRequest = Partial<CreateBranchRequest>;
