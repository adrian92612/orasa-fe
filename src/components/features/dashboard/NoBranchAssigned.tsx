import { Building2 } from "lucide-react";

export const NoBranchAssigned = () => {
  return (
    <div className="flex h-112.5 shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-105 flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Branch Assigned</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You currently don't have access to any branches. Please contact the
          business owner to get assigned to a branch.
        </p>
      </div>
    </div>
  );
};
