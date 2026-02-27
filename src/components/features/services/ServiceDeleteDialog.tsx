import DeleteDialog from "@/components/common/DeleteDialog";
import type { ServiceResponse } from "@/types/service";
import { useDeleteService } from "@/hooks/useServices";
import { toast } from "sonner";

type ServiceDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceResponse | null;
};

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
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleDelete}
      isDeleting={deleteMutation.isPending}
      confirmText="Delete Service"
      description={
        <>
          This will permanently delete the service{" "}
          <span className="font-semibold text-foreground">
            "{service?.name}"
          </span>
          . This action cannot be undone.
        </>
      }
    />
  );
};

export default ServiceDeleteDialog;
