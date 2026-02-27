import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SavingIndicator } from "@/components/common/SavingIndicator";
import { cn } from "@/lib/utils";

import type { StaffResponse } from "@/types/staff";

type StaffCardProps = {
  member: StaffResponse;
  isSaving?: boolean;
  onEdit: (staff: StaffResponse) => void;
  onDelete: (staff: StaffResponse) => void;
};

const StaffCard = ({ member, isSaving, onEdit, onDelete }: StaffCardProps) => {
  const isOptimistic = member.id.startsWith("temp-");
  const showSaving = isSaving || isOptimistic;

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:bg-accent/40 hover:shadow-sm",
        showSaving && "opacity-70 grayscale-[0.5]",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium truncate">{member.username}</h3>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {member.branches.map((branch) => (
                <span
                  key={branch.id}
                  className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {branch.name}
                </span>
              ))}
              {member.branches.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  No branches assigned
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSaving && <SavingIndicator />}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => onEdit(member)}
              disabled={showSaving}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={showSaving}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onClick={() => onDelete(member)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Staff
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StaffCard;
