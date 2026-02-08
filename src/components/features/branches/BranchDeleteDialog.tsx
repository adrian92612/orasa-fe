import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/common/LoadingButton";
import type { BranchResponse } from "@/types/branch";
import { useDeleteBranch } from "@/hooks/useBranches";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: BranchResponse;
  onSuccess?: () => void;
}

const BranchDeleteDialog = ({
  open,
  onOpenChange,
  branch,
  onSuccess,
}: Props) => {
  const [confirmName, setConfirmName] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmName("");
    }
    onOpenChange(isOpen);
  };

  const deleteMutation = useDeleteBranch();

  const handleDelete = () => {
    deleteMutation.mutate(branch.id, {
      onSuccess: () => {
        handleOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Branch</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            branch <strong>{branch.name}</strong> and remove all associated
            data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Please type <strong>{branch.name}</strong> to confirm.
          </p>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder="Type branch name"
            className="col-span-3"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            variant="destructive"
            label="Delete Branch"
            loadingLabel="Deleting..."
            isLoading={deleteMutation.isPending}
            disabled={confirmName !== branch.name}
            onClick={handleDelete}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDeleteDialog;
