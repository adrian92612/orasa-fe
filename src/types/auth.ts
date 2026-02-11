export type StaffLoginRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  userId: string;
  username: string;
  role: "OWNER" | "STAFF" | "ADMIN";
  businessId: string | null;
  businessName?: string;
  branchIds: string[];
  branches: {
    id: string;
    name: string;
  }[];
};

export type ChangePasswordRequest = {
  currentPassword?: string;
  newPassword: string;
};
