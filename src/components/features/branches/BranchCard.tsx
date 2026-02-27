import type { BranchResponse } from "@/types/branch";
import { Building2, MapPin, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavingIndicator } from "@/components/common/SavingIndicator";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BranchCardProps = {
  branch: BranchResponse;
  isSaving?: boolean;
  onEdit: (branch: BranchResponse) => void;
};

const BranchCard = ({ branch, isSaving, onEdit }: BranchCardProps) => {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow relative",
        isSaving && "opacity-70 grayscale-[0.5]",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">
          {branch.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          {isSaving && <SavingIndicator />}
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
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
      <CardFooter className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("w-full", isSaving && "pointer-events-none")}
          disabled={isSaving}
          onClick={() => onEdit(branch)}
        >
          {isSaving ? "Saving..." : "Manage Branch"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BranchCard;
