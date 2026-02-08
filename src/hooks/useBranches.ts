import { useQuery } from "@tanstack/react-query";
import { branchService } from "@/services/branch.service";
import { Q_KEYS } from "@/constants/queryKeys";

export const useBranches = () => {
  return useQuery({
    queryKey: [Q_KEYS.BRANCHES],
    queryFn: async () => {
      const response = await branchService.getAllBranches();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
