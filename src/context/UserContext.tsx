import { Q_KEYS } from "@/constants/queryKeys";
import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useState } from "react";

export type UserRole = "OWNER" | "STAFF" | "ADMIN";

export type User = {
  userId: string;
  username: string;
  role: UserRole;
  businessId: string | null;
  businessName?: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => void;
  logout: () => void;
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [Q_KEYS.CURRENT_USER],
    queryFn: async () => {
      try {
        const response = await apiClient.get<User>(API_ROUTES.AUTH.ME);
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = async () => {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT, {});
      sessionStorage.removeItem("subscription-banner-dismissed");
      await refetch();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        refetchUser: refetch,
        logout,
        selectedBranchId,
        setSelectedBranchId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
