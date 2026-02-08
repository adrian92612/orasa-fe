export type ServiceResponse = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes: number;
  availableGlobally: boolean; // Changed from isAvailableGlobally to match backend JSON default
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceRequest = {
  name: string;
  description?: string;
  basePrice: number;
  durationMinutes: number;
  availableGlobally?: boolean;
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
