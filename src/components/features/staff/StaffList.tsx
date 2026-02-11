import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react";

import type { StaffResponse } from "@/types/staff";

type StaffListProps = {
  staff: StaffResponse[];
  isLoading: boolean;
  isSearchActive: boolean;
  onEdit: (staff: StaffResponse) => void;
  onDelete: (staff: StaffResponse) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

const StaffList = ({
  staff,
  isLoading,
  isSearchActive,
  onEdit,
  onDelete,
  emptyTitle = "No staff found",
  emptyDescription = "You haven't added any staff yet. Staff members you add will appear here.",
}: StaffListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <User className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="font-semibold text-lg">
          {isSearchActive ? "No results found" : emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isSearchActive
            ? "Try adjusting your search query."
            : emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {staff.map((member) => (
        <div
          key={member.id}
          className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
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

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => onEdit(member)}
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
      ))}
    </div>
  );
};

export default StaffList;
