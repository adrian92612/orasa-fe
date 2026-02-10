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
  useUpdateServiceLink,
  useAssignServiceToBranch,
} from "@/hooks/useServices";

const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  basePrice: z.number().min(1, "Price must be greater than 0"),
  durationMinutes: z.number().min(1, "Duration must be greater than 0"),
  customPrice: z
    .number()
    .min(1, "Price must be greater than 0")
    .nullable()
    .optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

type ServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: ServiceResponse | null;
  branchId?: string | null;
};

const ServiceDialog = ({
  open,
  onOpenChange,
  serviceToEdit,
  branchId,
}: ServiceDialogProps) => {
  const isEditing = !!serviceToEdit;
  const isBranchMode = !!branchId && isEditing; // Only applicable when editing existing services in a branch context

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const updateLinkMutation = useUpdateServiceLink();
  const assignMutation = useAssignServiceToBranch();

  const { control, handleSubmit, reset } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      durationMinutes: 30,
      customPrice: null,
    },
  });

  useEffect(() => {
    if (serviceToEdit) {
      reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
        basePrice: serviceToEdit.basePrice,
        durationMinutes: serviceToEdit.durationMinutes,
        customPrice: serviceToEdit.customPrice || null,
      });
    } else {
      reset({
        name: "",
        description: "",
        basePrice: 0,
        durationMinutes: 30,
        customPrice: null,
      });
    }
  }, [serviceToEdit, reset]);

  const onSubmit = (data: ServiceFormValues) => {
    if (isBranchMode && serviceToEdit && branchId) {
      // Branch Override Mode
      if (serviceToEdit.linkId) {
        updateLinkMutation.mutate({
          branchId,
          linkId: serviceToEdit.linkId,
          data: {
            serviceId: serviceToEdit.id,
            active: serviceToEdit.isActive, // Keep active state
            customPrice: data.customPrice || undefined,
          },
        });
      } else {
        // Assigning for the first time with custom price?
        assignMutation.mutate({
          branchId,
          data: {
            serviceId: serviceToEdit.id,
            active: true, // Auto-activate if we are "editing" it into the branch?
            customPrice: data.customPrice || undefined,
          },
        });
      }
      onOpenChange(false);
    } else if (isEditing && serviceToEdit) {
      // Global Edit Mode
      updateMutation.mutate({
        id: serviceToEdit.id,
        data: {
          name: data.name,
          description: data.description,
          basePrice: data.basePrice,
          durationMinutes: data.durationMinutes,
        },
      });
      onOpenChange(false);
    } else {
      // Create Mode (Always Global)
      createMutation.mutate({
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        durationMinutes: data.durationMinutes,
      });
      onOpenChange(false);
      reset();
    }
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    updateLinkMutation.isPending ||
    assignMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {isBranchMode
              ? "This only affects this branch. Global service details cannot be changed here."
              : isEditing
                ? "Changes here will update the service for all branches."
                : "Create a service that will be available across all branches. You can later override pricing per branch."}
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
                    <FieldLabel htmlFor={field.name}>Service Name *</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Basic Haircut"
                      disabled={isPending || isBranchMode} // Disable name edit in branch mode
                    />
                    {isBranchMode && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Global service name cannot be changed from a branch
                        view.
                      </p>
                    )}
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
                      disabled={isPending || isBranchMode}
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
                        {isBranchMode ? "Base Price (Global)" : "Price (PHP) *"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min="0"
                        step="0.01"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isPending || isBranchMode} // Disable base price in branch mode
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {isBranchMode && (
                  <Controller
                    name="customPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Branch Price (Override)
                        </FieldLabel>
                        <Input
                          value={field.value ?? ""}
                          id={field.name}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Same as base"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : Number(val));
                          }}
                          disabled={isPending}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}

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
