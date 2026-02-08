import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { branchService } from "@/services/branch.service";
import { Q_KEYS } from "@/constants/queryKeys";
import type { BranchResponse } from "@/types/branch";

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
  const queryClient = useQueryClient();
  const [confirmName, setConfirmName] = useState("");

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmName("");
    }
    onOpenChange(isOpen);
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return branchService.deleteBranch(branch.id);
    },
    onSuccess: () => {
      queryClient.setQueryData<BranchResponse[]>(
        [Q_KEYS.BRANCHES],
        (old = []) => old.filter((b) => b.id !== branch.id),
      );

      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
      handleOpenChange(false);
      onSuccess?.();
    },
  });

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
            onClick={() => deleteMutation.mutate()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDeleteDialog;
