import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { branchService } from "@/services/branch.service";
import { staffService } from "@/services/staff.service";
import { serviceService } from "@/services/service.service";

import BranchList from "@/components/features/branches/BranchList";
import BranchDialog from "@/components/features/branches/BranchDialog";

import type { BranchResponse } from "@/types/branch";

import { Q_KEYS } from "@/constants/queryKeys";

const BranchesPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(
    null,
  );

  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: [Q_KEYS.BRANCHES],
    queryFn: async () => {
      const res = await branchService.getAllBranches();
      return res.data || [];
    },
  });

  const { data: staffList = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: [Q_KEYS.STAFFS],
    queryFn: async () => {
      const res = await staffService.getAllStaff();
      return res.data || [];
    },
    staleTime: Infinity,
  });

  const { data: serviceList = [], isLoading: isLoadingServices } = useQuery({
    queryKey: [Q_KEYS.SERVICES],
    queryFn: async () => {
      const res = await serviceService.getServices();
      return res.data || [];
    },
    staleTime: Infinity,
  });

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
        isLoading={isLoadingBranches}
        onEdit={handleEdit}
      />

      <BranchDialog
        key={selectedBranch?.id || "new"}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        branchToEdit={selectedBranch}
        staffList={staffList}
        serviceList={serviceList}
        isLoadingStaff={isLoadingStaff}
        isLoadingServices={isLoadingServices}
      />
    </div>
  );
};

export default BranchesPage;
