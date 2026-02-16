import type { BranchResponse } from "@/types/branch";
import { Building2, MapPin, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <Card key={i} className="h-40 animate-pulse" />
        ))}
      </div>
    );
  }

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
        <Card key={branch.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight">
              {branch.name}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
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
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onEdit(branch)}
            >
              Manage Branch
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BranchList;
