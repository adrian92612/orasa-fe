import { useState, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import BranchList from "@/components/features/branches/BranchList";
import { BranchListSkeleton } from "@/components/features/branches/BranchListSkeleton";

import type { BranchResponse } from "@/types/branch";

import { useSuspenseBranches } from "@/hooks/useBranches";
import { useSuspenseServices } from "@/hooks/useServices";
import { useSuspenseStaff } from "@/hooks/useStaff";

import { useMutationState } from "@tanstack/react-query";
import { Q_KEYS } from "@/constants/queryKeys";

const BranchDialog = lazy(
  () => import("@/components/features/branches/BranchDialog"),
);

type BranchesDataSectionProps = {
  selectedBranch: BranchResponse | null;
  onEdit: (branch: BranchResponse) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
};

const BranchesDataSection = ({
  selectedBranch,
  onEdit,
  isSheetOpen,
  setIsSheetOpen,
}: BranchesDataSectionProps) => {
  const { data: branches } = useSuspenseBranches();
  const { data: staffList = [] } = useSuspenseStaff();
  const { data: serviceList = [] } = useSuspenseServices();

  const pendingUpdateMutations = useMutationState({
    filters: {
      status: "pending",
      mutationKey: [Q_KEYS.BRANCHES, Q_KEYS.UPDATE],
    },
    select: (mutation) => mutation.state.variables as any,
  });

  const pendingDeleteMutations = useMutationState({
    filters: {
      status: "pending",
      mutationKey: [Q_KEYS.BRANCHES, Q_KEYS.DELETE],
    },
    select: (mutation) => mutation.state.variables as any,
  });

  const checkIsSaving = (branchId: string) => {
    const isUpdating = pendingUpdateMutations.some(
      (vars) => vars?.id === branchId,
    );
    const isDeleting = pendingDeleteMutations.some((id) => id === branchId);
    return isUpdating || isDeleting;
  };

  return (
    <>
      <BranchList
        branches={branches || []}
        onEdit={onEdit}
        checkIsSaving={checkIsSaving}
      />

      <Suspense fallback={null}>
        <BranchDialog
          key={selectedBranch?.id || "new"}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          branchToEdit={selectedBranch}
          staffList={staffList}
          serviceList={serviceList}
        />
      </Suspense>
    </>
  );
};

const BranchesPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(
    null,
  );

  const handleCreate = () => {
    setSelectedBranch(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (branch: BranchResponse) => {
    setSelectedBranch(branch);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Manage your business branches and locations.
        </p>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <Suspense fallback={<BranchListSkeleton />}>
        <BranchesDataSection
          selectedBranch={selectedBranch}
          onEdit={handleEdit}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
        />
      </Suspense>
    </div>
  );
};

export default BranchesPage;
