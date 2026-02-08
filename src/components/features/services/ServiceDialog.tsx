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
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldContent,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  CreateServiceRequest,
  ServiceResponse,
  UpdateServiceRequest,
} from "@/types/service";
import LoadingButton from "@/components/common/LoadingButton";
import { useCreateService, useUpdateService } from "@/hooks/useServices";
import { toast } from "sonner";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  basePrice: z.number().min(0, "Price must be non-negative"),
  durationMinutes: z.number().min(1, "Duration must be positive"),
  availableGlobally: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: ServiceResponse | null;
}

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
      basePrice: 0,
      durationMinutes: 30, // Default to 30 mins
      availableGlobally: true,
    },
  });

  // Reset form when serviceToEdit changes
  useEffect(() => {
    if (serviceToEdit) {
      reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
        basePrice: serviceToEdit.basePrice,
        durationMinutes: serviceToEdit.durationMinutes,
        availableGlobally: serviceToEdit.availableGlobally,
      });
    } else {
      reset({
        name: "",
        description: "",
        basePrice: 0,
        durationMinutes: 30,
        availableGlobally: true,
      });
    }
  }, [serviceToEdit, reset]);

  const onSubmit = (data: ServiceFormValues) => {
    if (isEditing && serviceToEdit) {
      updateMutation.mutate(
        {
          id: serviceToEdit.id,
          data: data as UpdateServiceRequest,
        },
        {
          onSuccess: () => {
            toast.success("Service updated", {
              description: `${data.name} has been updated successfully.`,
            });
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error("Failed to update service", {
              description: error.message,
            });
          },
        },
      );
    } else {
      createMutation.mutate(data as CreateServiceRequest, {
        onSuccess: () => {
          toast.success("Service created", {
            description: `${data.name} has been created successfully.`,
          });
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          toast.error("Failed to create service", {
            description: error.message,
          });
        },
      });
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
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Service Name *</FieldLabel>
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

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="basePrice"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Price (PHP) *
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min="0"
                        step="0.01"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="durationMinutes"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Duration (mins) *
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min="1"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isPending}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="availableGlobally"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="items-start gap-4"
                  >
                    <Checkbox
                      id={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      className="mt-1 size-5 shrink-0"
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name} className="font-bold">
                        Available to all branches by default
                      </FieldLabel>
                      <FieldDescription>
                        If unchecked, you'll need to manually enable this
                        service per branch.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
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
