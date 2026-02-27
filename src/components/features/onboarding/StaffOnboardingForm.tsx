import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateStaff } from "@/hooks/useStaff";

const staffSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    temporaryPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.temporaryPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type StaffValues = z.infer<typeof staffSchema>;

type StaffOnboardingFormProps = {
  onFinish: () => void;
  branchId: string;
};

const StaffOnboardingForm = ({
  onFinish,
  branchId,
}: StaffOnboardingFormProps) => {
  const { control, handleSubmit } = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      temporaryPassword: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createStaff, isPending } = useCreateStaff();

  const onSubmit = (data: StaffValues) => {
    createStaff(
      {
        username: data.username,
        temporaryPassword: data.temporaryPassword,
        branchIds: [branchId],
      },
      {
        onSuccess: () => {
          onFinish();
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Add Staff Member</CardTitle>
        <CardDescription>
          Create an account for your staff, or skip to finish.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Controller
                control={control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username" required>
                      Username
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="username"
                        placeholder="johndoe"
                        autoComplete="username"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="temporaryPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="temporaryPassword" required>
                      Password
                    </FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input
                          id="temporaryPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          autoComplete="new-password"
                          {...field}
                          aria-invalid={fieldState.invalid}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword" required>
                      Confirm Password
                    </FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          autoComplete="new-password"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full" type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Staff...
                    </>
                  ) : (
                    "Create & Finish"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={onFinish}
                  disabled={isPending}
                >
                  Skip & Finish
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default StaffOnboardingForm;
