import { Q_KEYS } from "@/constants/queryKeys";
import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useState } from "react";
import { getCookie, decodeJwt } from "@/lib/jwt-utils";

export type UserRole = "OWNER" | "STAFF" | "ADMIN";

export type User = {
  userId: string;
  username: string;
  role: UserRole;
  businessId: string | null;
  businessName: string | null;
};

type JwtPayload = {
  sub: string;
  username: string;
  role: UserRole;
  businessId?: string;
  businessName?: string;
};

type UserContextType = {
  user: User | null;
  error: Error | null;
  refetchUser: () => void;
  logout: () => void;
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Try to get initial user from JWT cookie for immediate route guarding
  const token = getCookie("token");
  const payload = token ? decodeJwt<JwtPayload>(token) : null;

  const initialUserFromToken = payload
    ? {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
        businessId: payload.businessId || null,
        businessName: payload.businessName || null,
      }
    : null;

  const {
    data: user,
    error,
    refetch,
  } = useSuspenseQuery({
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
        user: user || initialUserFromToken,
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
