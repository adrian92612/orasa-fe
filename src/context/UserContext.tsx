import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";

export type UserRole = "OWNER" | "STAFF" | "ADMIN";

export type User = {
  userId: string;
  username: string;
  role: UserRole;
  businessId: string | null;
  branchIds: string[];
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<User>(API_ROUTES.AUTH.ME);
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        // If 401/403, just return null (not logged in)
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <UserContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error as Error | null,
        refetchUser: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
