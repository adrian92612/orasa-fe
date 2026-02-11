import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { type ChangePasswordRequest } from "@/types/auth";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      console.error("Error changing password:", error);
      toast.error(error?.message || "Failed to change password");
    },
  });
};
