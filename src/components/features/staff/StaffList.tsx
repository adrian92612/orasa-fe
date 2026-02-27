import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMutationState } from "@tanstack/react-query";
import { Q_KEYS } from "@/constants/queryKeys";

import type { StaffResponse } from "@/types/staff";
import StaffCard from "./StaffCard";

type StaffListProps = {
  staff: StaffResponse[];
  isSearchActive: boolean;
  onEdit: (staff: StaffResponse) => void;
  onDelete: (staff: StaffResponse) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

const StaffList = ({
  staff,
  isSearchActive,
  onEdit,
  onDelete,
  emptyTitle = "No staff found",
  emptyDescription = "You haven't added any staff yet. Staff members you add will appear here.",
}: StaffListProps) => {
  const pendingMutations = useMutationState({
    filters: { status: "pending", mutationKey: [Q_KEYS.STAFFS] },
    select: (mutation) => mutation.state.variables as any,
  });

  const checkIsSaving = (id: string) =>
    pendingMutations.some((vars) => {
      if (typeof vars === "string") return vars === id;
      return vars?.id === id;
    });

  if (staff.length === 0) {
    return (
      <Card className="p-8 text-center">
        <User className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="font-semibold text-lg">
          {isSearchActive ? "No results found" : emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isSearchActive
            ? "Try adjusting your search query."
            : emptyDescription}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {staff.map((member) => (
        <StaffCard
          key={member.id}
          member={member}
          isSaving={checkIsSaving(member.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default StaffList;
