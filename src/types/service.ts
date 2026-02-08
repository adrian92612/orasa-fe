export type ServiceResponse = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes: number;
  isAvailableGlobally: boolean;
  createdAt: string;
  updatedAt: string;
};

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
};

export type AssignServiceToBranchRequest = {
  serviceId: string;
  customPrice?: number;
  active?: boolean;
};

export type UpdateBranchServiceRequest = {
  customPrice?: number;
  active?: boolean;
};
