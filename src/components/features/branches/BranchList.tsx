import type { BranchResponse } from "@/types/branch";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import BranchCard from "./BranchCard";

type BranchListProps = {
  branches: BranchResponse[];
  onEdit: (branch: BranchResponse) => void;
  checkIsSaving?: (branchId: string) => boolean;
};

const BranchList = ({ branches, onEdit, checkIsSaving }: BranchListProps) => {
  if (branches.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No branches found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first branch.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          isSaving={checkIsSaving?.(branch.id)}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default BranchList;
