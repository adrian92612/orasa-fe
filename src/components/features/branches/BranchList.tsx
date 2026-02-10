import type { BranchResponse } from "@/types/branch";
import { Building2, MapPin, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type BranchListProps = {
  branches: BranchResponse[];
  isLoading: boolean;
  onEdit: (branch: BranchResponse) => void;
};

const BranchList = ({ branches, isLoading, onEdit }: BranchListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-lg border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No branches found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first branch.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold tracking-tight">{branch.name}</h3>
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span className="truncate">{branch.address || "N/A"}</span>
              </div>

              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <span>{branch.phoneNumber || "N/A"}</span>
              </div>

              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>{branch.staffIds.length} Staff(s)</span>
              </div>

              <div className="flex items-center">
                <span className="mr-2 h-4 w-4 flex items-center justify-center font-bold text-xs border rounded-full border-current">
                  S
                </span>
                <span>{branch.serviceCount} Service(s)</span>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onEdit(branch)}
              >
                Manage Branch
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BranchList;
