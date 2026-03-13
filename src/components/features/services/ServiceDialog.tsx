import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceResponse } from "@/types/service";
import LoadingButton from "@/components/common/LoadingButton";
import {
  useCreateService,
  useUpdateService,
} from "@/hooks/useServices";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type ServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: ServiceResponse | null;
};

const ServiceDialog = ({
  open,
  onOpenChange,
  serviceToEdit,
}: ServiceDialogProps) => {
  const isEditing = !!serviceToEdit;

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const { control, handleSubmit, reset } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (serviceToEdit) {
      reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [serviceToEdit, reset]);

  const onSubmit = (data: ServiceFormValues) => {
    if (isEditing && serviceToEdit) {
      updateMutation.mutate({
        id: serviceToEdit.id,
        data: {
          name: data.name,
          description: data.description,
        },
      });
      onOpenChange(false);
    } else {
      createMutation.mutate({
        name: data.name,
        description: data.description,
      });
      onOpenChange(false);
      reset();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Changes here will update the service for all branches."
              : "Create a service that will be available across all branches."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Service Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Basic Haircut"
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Describe the service..."
                      disabled={isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={isPending}
                label={isEditing ? "Update Service" : "Create Service"}
                loadingLabel={isEditing ? "Updating..." : "Creating..."}
              />
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;

