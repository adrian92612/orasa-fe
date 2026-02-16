import { useState, lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import BranchList from "@/components/features/branches/BranchList";
import BranchesPageSkeleton from "@/components/features/branches/BranchesPageSkeleton";

import type { BranchResponse } from "@/types/branch";

import { useSuspenseBranches } from "@/hooks/useBranches";
import { useSuspenseServices } from "@/hooks/useServices";
import { useSuspenseStaff } from "@/hooks/useStaff";

const BranchDialog = lazy(
  () => import("@/components/features/branches/BranchDialog"),
);

const BranchesPageContent = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(
    null,
  );

  const { data: branches } = useSuspenseBranches();
  const { data: staffList = [] } = useSuspenseStaff();
  const { data: serviceList = [] } = useSuspenseServices();

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
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage your business branches and locations.
        </p>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <BranchList
        branches={branches || []}
        isLoading={false}
        onEdit={handleEdit}
      />

      <Suspense fallback={null}>
        <BranchDialog
          key={selectedBranch?.id || "new"}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          branchToEdit={selectedBranch}
          staffList={staffList}
          serviceList={serviceList}
          isLoadingStaff={false}
          isLoadingServices={false}
        />
      </Suspense>
    </div>
  );
};

const BranchesPage = () => {
  return (
    <Suspense fallback={<BranchesPageSkeleton />}>
      <BranchesPageContent />
    </Suspense>
  );
};

export default BranchesPage;
