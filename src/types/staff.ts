export type StaffResponse = {
  id: string;
  businessId: string;
  username: string;
  role: "OWNER" | "STAFF" | "ADMIN";
  branches: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
};

export type CreateStaffRequest = {
  username: string;
  temporaryPassword: string;
  branchIds: string[];
};

export type UpdateStaffRequest = {
  newPassword?: string;
  branchIds?: string[];
};
