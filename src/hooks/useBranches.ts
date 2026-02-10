import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { branchService } from "@/services/branch.service";
import { Q_KEYS } from "@/constants/queryKeys";
import type {
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchResponse,
} from "@/types/branch";
import { useUser } from "@/context/UserContext";

export const useBranches = () => {
  const { selectedBranchId, setSelectedBranchId } = useUser();
  const query = useQuery({
    queryKey: [Q_KEYS.BRANCHES],
    queryFn: branchService.getAllBranches,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      !query.isLoading &&
      query.data?.length === 1 &&
      selectedBranchId !== query.data[0].id
    ) {
      setSelectedBranchId(query.data[0].id);
    }
  }, [query.data, query.isLoading, selectedBranchId, setSelectedBranchId]);

  return query;
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { refetchUser } = useUser();

  return useMutation({
    mutationFn: (data: CreateBranchRequest) => branchService.createBranch(data),
    onSuccess: (newBranch) => {
      if (newBranch) {
        queryClient.setQueryData<BranchResponse[]>(
          [Q_KEYS.BRANCHES],
          (old = []) => [...old, newBranch],
        );
        toast.success("Branch created", {
          description: `${newBranch.name} has been created successfully.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      refetchUser();
    },
    onError: (error) => {
      toast.error("Failed to create branch", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const { refetchUser } = useUser();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchRequest }) =>
      branchService.updateBranch(id, data),
    onSuccess: (updatedBranch) => {
      if (updatedBranch) {
        queryClient.setQueryData<BranchResponse[]>(
          [Q_KEYS.BRANCHES],
          (old = []) =>
            old.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)),
        );
        toast.success("Branch updated", {
          description: `${updatedBranch.name} has been updated successfully.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      refetchUser();
    },
    onError: (error) => {
      toast.error("Failed to update branch", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchService.deleteBranch(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<BranchResponse[]>(
        [Q_KEYS.BRANCHES],
        (old = []) => old.filter((b) => b.id !== deletedId),
      );
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
      toast.success("Branch deleted", {
        description: "Branch has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to delete branch", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};
