export type ServiceResponse = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  linkId?: string;
  isOptimistic?: boolean;
  customPrice?: number;
  effectivePrice?: number;
};

export type CreateServiceRequest = {
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes: number;
};

export type UpdateServiceRequest = Partial<CreateServiceRequest>;

export type BranchServiceResponse = {
  id: string;
  branchId: string;
  serviceId: string;
  serviceName: string;
  serviceDescription?: string;
  basePrice: number;
  customPrice?: number;
  effectivePrice: number;
  durationMinutes: number;
  active: boolean;
  createdAt: string;
  isOptimistic?: boolean;
};

export type AssignServiceToBranchRequest = {
  serviceId: string;
  customPrice?: number;
  active?: boolean;
};

export type UpdateBranchServiceRequest = {
  serviceId: string;
  customPrice?: number;
  active?: boolean;
};
