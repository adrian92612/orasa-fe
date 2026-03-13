export type ServiceResponse = {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceRequest = {
  name: string;
  description?: string;
};

export type UpdateServiceRequest = Partial<CreateServiceRequest>;

