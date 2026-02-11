import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteStaff } from "@/hooks/useStaff";

import type { StaffResponse } from "@/types/staff";

type StaffDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffResponse | null;
};

const StaffDeleteDialog = ({
  open,
  onOpenChange,
  staff,
}: StaffDeleteDialogProps) => {
  const deleteMutation = useDeleteStaff();

  const handleDelete = () => {
    if (!staff) return;

    deleteMutation.mutate(staff.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the staff member{" "}
            <span className="font-semibold text-foreground">
              "{staff?.username}"
            </span>
            . They will no longer be able to log in. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Staff"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StaffDeleteDialog;
