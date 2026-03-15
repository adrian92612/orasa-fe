import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectGroup,
} from "@/components/ui/multi-select";

import LoadingButton from "@/components/common/LoadingButton";
import BranchDeleteDialog from "./BranchDeleteDialog";
import type { BranchResponse } from "@/types/branch";
import type { StaffResponse } from "@/types/staff";
import { useCreateBranch, useUpdateBranch } from "@/hooks/useBranches";
import { arraysEqual, isValidPHPhone } from "@/lib/utils";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Branch name is required")
    .max(35, "Branch name must not exceed 35 characters")
    .regex(/^[a-zA-Z0-9 ]*$/, "Only alphanumeric characters and spaces are allowed"),
  address: z.string().trim().optional(),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || isValidPHPhone(val), {
      message: "Phone number must start with 09 and be 11 digits long",
    }),
  staffIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchToEdit?: BranchResponse | null;
  staffList: StaffResponse[];
};

const BranchDialog = ({ open, onOpenChange, branchToEdit, staffList }: Props) => {
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  const isEditing = !!branchToEdit;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: branchToEdit?.name || "",
      address: branchToEdit?.address || "",
      phoneNumber: branchToEdit?.phoneNumber || "",
      staffIds: branchToEdit?.staffIds || [],
    },
  });

  const watchedValues = useWatch({ control });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasFormChanged = () => {
    if (!isEditing || !branchToEdit) return false;

    const currentValues = watchedValues;

    if ((currentValues.name || "").trim() !== (branchToEdit.name || "").trim()) return true;
    if ((currentValues.address || "").trim() !== (branchToEdit.address || "").trim()) return true;
    if ((currentValues.phoneNumber || "").trim() !== (branchToEdit.phoneNumber || "").trim()) return true;

    if (!arraysEqual(currentValues.staffIds || [], branchToEdit.staffIds || [])) return true;

    return false;
  };

  const isFormUnchanged = isEditing && !hasFormChanged();

  useEffect(() => {
    if (!open) return;

    if (branchToEdit) {
      reset({
        name: branchToEdit.name,
        address: branchToEdit.address || "",
        phoneNumber: branchToEdit.phoneNumber || "",
        staffIds: branchToEdit.staffIds || [],
      });
    } else {
      reset({
        name: "",
        address: "",
        phoneNumber: "",
        staffIds: [],
      });
    }
  }, [open, branchToEdit, reset]);

  const onSubmit = (data: FormValues) => {
    const trimmedData: FormValues = {
      ...data,
      name: data.name.trim(),
      address: data.address?.trim(),
      phoneNumber: data.phoneNumber?.trim(),
    };

    if (isEditing && branchToEdit) {
      updateMutation.mutate(
        { id: branchToEdit.id, data: trimmedData },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        },
      );
    } else {
      createMutation.mutate(trimmedData, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }

    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogDescription>Manage branch info and assignments.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending} className="space-y-5">
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Branch Name</FieldLabel>
                    <Input {...field} id={field.name} maxLength={35} aria-invalid={fieldState.invalid} />
                    <p className="mt-1 text-xs text-muted-foreground">Max 35 characters. Alphanumeric only.</p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input {...field} id={field.name} value={field.value || ""} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.value || ""}
                      placeholder="e.g. 09123456789"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          if (val.length <= 11) {
                            field.onChange(val);
                          }
                        }
                      }}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="staffIds"
                control={control}
                render={({ field, fieldState }) => {
                  const allStaffIds = staffList.map((s) => s.id);

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="flex items-center gap-2">Staffs</FieldLabel>

                      <div className="flex gap-2 mb-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => field.onChange(allStaffIds)}>
                          Select all
                        </Button>

                        <Button type="button" size="sm" variant="ghost" onClick={() => field.onChange([])}>
                          Clear
                        </Button>
                      </div>

                      <MultiSelect values={field.value} onValuesChange={field.onChange}>
                        <MultiSelectTrigger>
                          <MultiSelectValue placeholder="Select staff" />
                        </MultiSelectTrigger>

                        <MultiSelectContent>
                          <MultiSelectGroup heading="Staff">
                            {staffList.map((s) => (
                              <MultiSelectItem key={s.id} value={s.id}>
                                {s.username}
                              </MultiSelectItem>
                            ))}
                          </MultiSelectGroup>
                        </MultiSelectContent>
                      </MultiSelect>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />

            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                label={isEditing ? "Save Changes" : "Create Branch"}
                loadingLabel="Saving..."
                isLoading={isPending}
                disabled={isEditing && isFormUnchanged}
              />
            </DialogFooter>

            {isEditing && branchToEdit && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground">
                      Deleting a branch is irreversible. Please be certain.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="self-start mt-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Branch
                  </Button>
                </div>

                <BranchDeleteDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                  branch={branchToEdit}
                  onSuccess={() => onOpenChange(false)}
                />
              </div>
            )}
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDialog;
