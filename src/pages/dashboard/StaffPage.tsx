import { lazy, Suspense, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { useSuspenseStaff } from "@/hooks/useStaff";

import type { StaffResponse } from "@/types/staff";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StaffList from "@/components/features/staff/StaffList";
import { StaffPageSkeleton } from "@/components/features/staff/StaffPageSkeleton";

const StaffDialog = lazy(
  () => import("@/components/features/staff/StaffDialog"),
);
const StaffDeleteDialog = lazy(
  () => import("@/components/features/staff/StaffDeleteDialog"),
);

const StaffPageContent = () => {
  const { data: staff } = useSuspenseStaff();

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffResponse | null>(
    null,
  );

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return staff;
    const query = searchQuery.toLowerCase();
    return staff.filter(
      (s) =>
        s.username.toLowerCase().includes(query) ||
        s.branches.some((b) => b.name.toLowerCase().includes(query)),
    );
  }, [staff, searchQuery]);

  const handleCreate = () => {
    setSelectedStaff(null);
    setDialogOpen(true);
  };

  const handleEdit = (member: StaffResponse) => {
    setSelectedStaff(member);
    setDialogOpen(true);
  };

  const handleDelete = (member: StaffResponse) => {
    setSelectedStaff(member);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or branch..."
              className="pl-9 h-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <StaffList
        staff={filteredStaff}
        isLoading={false}
        isSearchActive={!!searchQuery.trim()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Suspense fallback={null}>
        <StaffDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          staff={selectedStaff}
        />
        <StaffDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          staff={selectedStaff}
        />
      </Suspense>
    </div>
  );
};

const StaffPage = () => {
  return (
    <Suspense fallback={<StaffPageSkeleton />}>
      <StaffPageContent />
    </Suspense>
  );
};

export default StaffPage;
