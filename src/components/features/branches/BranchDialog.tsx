import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field";

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

import { branchService } from "@/services/branch.service";

import type { BranchResponse } from "@/types/branch";
import type { StaffResponse } from "@/types/staff";
import type { ServiceResponse } from "@/types/service";

import { Q_KEYS } from "@/constants/queryKeys";
import { useUser } from "@/context/UserContext";

const schema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  staffIds: z.array(z.string()),
  serviceIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchToEdit?: BranchResponse | null;
  staffList: StaffResponse[];
  serviceList: ServiceResponse[];
  isLoadingStaff?: boolean;
  isLoadingServices?: boolean;
}

const BranchDialog = ({
  open,
  onOpenChange,
  branchToEdit,
  staffList,
  serviceList,
  isLoadingStaff,
  isLoadingServices,
}: Props) => {
  const queryClient = useQueryClient();
  const { refetchUser } = useUser();
  const isEditing = !!branchToEdit;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: branchToEdit?.name || "",
      address: branchToEdit?.address || "",
      phoneNumber: branchToEdit?.phoneNumber || "",
      staffIds: branchToEdit?.staffIds || [],
      serviceIds: branchToEdit?.activeServiceIds || [],
    },
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (branchToEdit) {
      reset({
        name: branchToEdit.name,
        address: branchToEdit.address || "",
        phoneNumber: branchToEdit.phoneNumber || "",
        staffIds: branchToEdit.staffIds || [],
        serviceIds: branchToEdit.activeServiceIds || [],
      });
    } else {
      reset({
        name: "",
        address: "",
        phoneNumber: "",
        staffIds: [],
        serviceIds: [],
      });
    }
  }, [open, branchToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      let res;

      if (isEditing && branchToEdit) {
        res = await branchService.updateBranch(branchToEdit.id, data);
      } else {
        res = await branchService.createBranch(data);
      }

      return res.data!;
    },

    onSuccess: (branch: BranchResponse) => {
      queryClient.setQueryData(
        [Q_KEYS.BRANCHES],
        (old: BranchResponse[] | undefined) => {
          if (!old) return [branch];

          if (isEditing) {
            return old.map((b) => (b.id === branch.id ? branch : b));
          }

          return [...old, branch];
        },
      );

      queryClient.invalidateQueries({ queryKey: [Q_KEYS.STAFFS] });
      queryClient.invalidateQueries({ queryKey: [Q_KEYS.SERVICES] });
      refetchUser();

      onOpenChange(false);
      reset();
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Branch" : "Add New Branch"}
          </DialogTitle>
          <DialogDescription>
            Manage branch info and assignments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <fieldset disabled={mutation.isPending} className="space-y-5">
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Branch Name</FieldLabel>
                    <FieldContent>
                      <Input {...field} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <FieldContent>
                      <Input {...field} value={field.value || ""} />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="e.g. 09123456789"
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="staffIds"
                control={control}
                render={({ field }) => {
                  const allStaffIds = staffList.map((s) => s.id);

                  return (
                    <Field>
                      <FieldLabel className="flex items-center gap-2">
                        Staffs
                        {isLoadingStaff && (
                          <span className="text-xs font-normal text-muted-foreground animate-pulse">
                            (Loading...)
                          </span>
                        )}
                      </FieldLabel>

                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isLoadingStaff}
                          onClick={() => field.onChange(allStaffIds)}
                        >
                          Select all
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isLoadingStaff}
                          onClick={() => field.onChange([])}
                        >
                          Clear
                        </Button>
                      </div>

                      <FieldContent>
                        <MultiSelect
                          values={field.value}
                          onValuesChange={field.onChange}
                          disabled={isLoadingStaff}
                        >
                          <MultiSelectTrigger>
                            <MultiSelectValue
                              placeholder={
                                isLoadingStaff
                                  ? "Loading staff..."
                                  : "Select staff"
                              }
                            />
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
                      </FieldContent>
                    </Field>
                  );
                }}
              />

              <Controller
                name="serviceIds"
                control={control}
                render={({ field }) => {
                  const allServiceIds = serviceList.map((s) => s.id);

                  return (
                    <Field>
                      <FieldLabel className="flex items-center gap-2">
                        Services
                        {isLoadingServices && (
                          <span className="text-xs font-normal text-muted-foreground animate-pulse">
                            (Loading...)
                          </span>
                        )}
                      </FieldLabel>

                      <div className="flex gap-2 mb-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isLoadingServices}
                          onClick={() => field.onChange(allServiceIds)}
                        >
                          Select all
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isLoadingServices}
                          onClick={() => field.onChange([])}
                        >
                          Clear
                        </Button>
                      </div>

                      <FieldContent>
                        <MultiSelect
                          values={field.value}
                          onValuesChange={field.onChange}
                          disabled={isLoadingServices}
                        >
                          <MultiSelectTrigger>
                            <MultiSelectValue
                              placeholder={
                                isLoadingServices
                                  ? "Loading services..."
                                  : "Select services"
                              }
                            />
                          </MultiSelectTrigger>

                          <MultiSelectContent>
                            <MultiSelectGroup heading="Services">
                              {serviceList.map((s) => (
                                <MultiSelectItem key={s.id} value={s.id}>
                                  {s.name}
                                </MultiSelectItem>
                              ))}
                            </MultiSelectGroup>
                          </MultiSelectContent>
                        </MultiSelect>
                      </FieldContent>
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                label={isEditing ? "Save Changes" : "Create Branch"}
                loadingLabel="Saving..."
                isLoading={mutation.isPending}
              />
            </DialogFooter>

            {isEditing && branchToEdit && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-medium text-destructive">
                      Danger Zone
                    </h4>
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
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDialog;
