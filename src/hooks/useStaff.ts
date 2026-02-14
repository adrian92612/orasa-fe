import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { staffService } from "@/services/staff.service";
import { Q_KEYS } from "@/constants/queryKeys";

import type {
  CreateStaffRequest,
  StaffResponse,
  UpdateStaffRequest,
} from "@/types/staff";
import type { BranchResponse } from "@/types/branch";

export const useStaff = () => {
  return useQuery({
    queryKey: [Q_KEYS.STAFFS],
    queryFn: staffService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuspenseStaff = () => {
  return useSuspenseQuery({
    queryKey: [Q_KEYS.STAFFS],
    queryFn: staffService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffService.create(data),
    onMutate: async (newStaff) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.STAFFS] });

      const previous = queryClient.getQueryData<StaffResponse[]>([
        Q_KEYS.STAFFS,
      ]);

      const allBranches =
        queryClient.getQueryData<BranchResponse[]>([Q_KEYS.BRANCHES]) ?? [];

      const optimistic: StaffResponse = {
        id: `temp-${Date.now()}`,
        businessId: "",
        username: newStaff.username,
        role: "STAFF",
        branches: newStaff.branchIds
          .map((id) => {
            const branch = allBranches.find((b) => b.id === id);
            return branch ? { id: branch.id, name: branch.name } : null;
          })
          .filter(Boolean) as { id: string; name: string }[],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<StaffResponse[]>([Q_KEYS.STAFFS], (old = []) => [
        ...old,
        optimistic,
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.STAFFS], context.previous);
      }
      toast.error("Failed to create staff member");
    },
    onSuccess: (response) => {
      const created = response.data;
      toast.success(response.message || "Staff member created", {
        description: created
          ? `${created.username} has been added successfully.`
          : undefined,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) =>
      staffService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.STAFFS] });

      const previous = queryClient.getQueryData<StaffResponse[]>([
        Q_KEYS.STAFFS,
      ]);

      const allBranches =
        queryClient.getQueryData<BranchResponse[]>([Q_KEYS.BRANCHES]) ?? [];

      queryClient.setQueryData<StaffResponse[]>([Q_KEYS.STAFFS], (old = []) =>
        old.map((s) =>
          s.id === id
            ? {
                ...s,
                branches: data.branchIds
                  ? (data.branchIds
                      .map((branchId) => {
                        const branch = allBranches.find(
                          (b) => b.id === branchId,
                        );
                        return branch
                          ? { id: branch.id, name: branch.name }
                          : null;
                      })
                      .filter(Boolean) as { id: string; name: string }[])
                  : s.branches,
              }
            : s,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.STAFFS], context.previous);
      }
      toast.error("Failed to update staff member");
    },
    onSuccess: (response) => {
      const updated = response.data;
      toast.success(response.message || "Staff member updated", {
        description: updated
          ? `${updated.username} has been updated successfully.`
          : undefined,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [Q_KEYS.STAFFS] });

      const previous = queryClient.getQueryData<StaffResponse[]>([
        Q_KEYS.STAFFS,
      ]);

      queryClient.setQueryData<StaffResponse[]>([Q_KEYS.STAFFS], (old = []) =>
        old.filter((s) => s.id !== id),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.STAFFS], context.previous);
      }
      toast.error("Failed to delete staff member");
    },
    onSuccess: (response) => {
      toast.success(response.message || "Staff member deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
    },
  });
};
