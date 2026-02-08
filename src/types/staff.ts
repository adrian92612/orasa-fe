export interface StaffResponse {
  id: string;
  businessId: string;
  username: string;
  email: string | null;
  role: 'OWNER' | 'STAFF' | 'ADMIN';
  mustChangePassword: boolean;
  branches: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}
