import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";

import { useBranches } from "@/hooks/useBranches";
import { useCreateStaff, useUpdateStaff } from "@/hooks/useStaff";

import type { StaffResponse } from "@/types/staff";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const createSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    temporaryPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    branchIds: z.array(z.string()).min(1, "At least one branch must be assigned"),
  })
  .refine((data) => data.temporaryPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const editSchema = z
  .object({
    username: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")).optional(),
    confirmPassword: z.string().optional(),
    branchIds: z.array(z.string()).min(1, "At least one branch must be assigned"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

type StaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: StaffResponse | null;
};

const StaffDialog = ({ open, onOpenChange, staff }: StaffDialogProps) => {
  const isEditing = !!staff;
  const [showPassword, setShowPassword] = useState(false);

  const { data: branches = [] } = useBranches();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  const { control, handleSubmit, reset } = useForm<CreateValues | EditValues>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      username: "",
      branchIds: [],
      confirmPassword: "",
      ...(isEditing ? { newPassword: "" } : { temporaryPassword: "" }),
    },
  });

  useEffect(() => {
    if (open) {
      if (staff) {
        reset({
          username: staff.username,
          newPassword: "",
          confirmPassword: "",
          branchIds: staff.branches.map((b) => b.id),
        });
      } else {
        reset({
          username: "",
          temporaryPassword: "",
          confirmPassword: "",
          branchIds: branches.length === 1 ? [branches[0].id] : [],
        });
      }
    }
  }, [open, staff, reset, branches]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CreateValues | EditValues) => {
    if (isEditing && staff) {
      const editData = data as EditValues;
      updateMutation.mutate({
        id: staff.id,
        data: {
          newPassword: editData.newPassword || undefined,
          branchIds: editData.branchIds,
        },
      });
    } else {
      const createData = data as CreateValues;
      createMutation.mutate({
        username: createData.username,
        temporaryPassword: createData.temporaryPassword,
        branchIds: createData.branchIds,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update details for ${staff.username}.` : "Create a new staff account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="staff-username" required>
                    Username
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="staff-username"
                      placeholder="johndoe"
                      {...field}
                      disabled={isEditing}
                      aria-invalid={!!fieldState.error}
                      autoComplete="username"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={control}
              name={isEditing ? "newPassword" : "temporaryPassword"}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="staff-password" required={!isEditing}>
                    {isEditing ? "New Password" : "Password"}
                    {isEditing && <span className="text-muted-foreground font-normal"> (optional)</span>}
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input
                        id="staff-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                        aria-invalid={!!fieldState.error}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="staff-confirm-password" required={!isEditing}>
                    Confirm Password
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input
                        id="staff-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                        aria-invalid={!!fieldState.error}
                        autoComplete="new-password"
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="branchIds"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>Assigned Branches</FieldLabel>
                  <FieldContent>
                    <div className="space-y-2 rounded-md border border-primary p-3">
                      {branches.map((branch) => (
                        <div key={branch.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`branch-${branch.id}`}
                            checked={field.value?.includes(branch.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? [];
                              field.onChange(
                                checked ? [...current, branch.id] : current.filter((id: string) => id !== branch.id),
                              );
                            }}
                          />
                          <Label htmlFor={`branch-${branch.id}`} className="text-sm font-normal cursor-pointer">
                            {branch.name}
                          </Label>
                        </div>
                      ))}
                      {branches.length === 0 && <p className="text-sm text-muted-foreground">No branches available</p>}
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Staff"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
