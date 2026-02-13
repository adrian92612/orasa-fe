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
import type { BusinessResponse } from "@/types/business";

type AdminConfirmationDialogProps = {
  confirmationState: {
    type: "ACTIVATE" | "CANCEL";
    business: BusinessResponse;
  } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const AdminConfirmationDialog = ({
  confirmationState,
  onOpenChange,
  onConfirm,
}: AdminConfirmationDialogProps) => {
  return (
    <AlertDialog open={!!confirmationState} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {confirmationState?.type === "ACTIVATE"
              ? "Activate Subscription?"
              : "Cancel Subscription?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmationState?.type === "ACTIVATE"
              ? `Are you sure you want to activate the subscription for ${confirmationState.business.name}?`
              : `Are you sure you want to CANCEL the subscription for ${confirmationState?.business.name}? The business will lose access immediately.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              confirmationState?.type === "CANCEL"
                ? "bg-destructive hover:bg-destructive/90"
                : ""
            }
            onClick={onConfirm}
          >
            {confirmationState?.type === "ACTIVATE"
              ? "Activate"
              : "Cancel Subscription"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminConfirmationDialog;
