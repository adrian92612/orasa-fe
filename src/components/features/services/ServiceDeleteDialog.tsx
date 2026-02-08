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
import type { ServiceResponse } from "@/types/service";
import { useDeleteService } from "@/hooks/useServices";
import { toast } from "sonner";

interface ServiceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceResponse | null;
}

const ServiceDeleteDialog = ({
  open,
  onOpenChange,
  service,
}: ServiceDeleteDialogProps) => {
  const deleteMutation = useDeleteService();

  const handleDelete = () => {
    if (!service) return;

    deleteMutation.mutate(service.id, {
      onSuccess: () => {
        toast.success("Service deleted", {
          description: `${service.name} has been deleted successfully.`,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to delete service", {
          description: error.message,
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the service{" "}
            <span className="font-semibold text-foreground">
              "{service?.name}"
            </span>
            . This action cannot be undone.
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
            {deleteMutation.isPending ? "Deleting..." : "Delete Service"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ServiceDeleteDialog;
