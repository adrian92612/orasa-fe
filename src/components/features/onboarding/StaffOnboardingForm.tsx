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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const staffSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  temporaryPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      username: "",
      temporaryPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: createStaff, isPending } = useMutation({
    mutationFn: async (data: StaffValues) => {
      const result = await apiClient.post(API_ROUTES.STAFF.CREATE, {
        ...data,
        branchIds: [branchId],
      });
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        onFinish();
      } else {
        console.error("Staff creation failed:", result);
      }
    },
    onError: (error) => {
      console.error("Error creating staff:", error);
    },
  });

  const onSubmit = (data: StaffValues) => {
    createStaff(data);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <FieldContent>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      {...field}
                      aria-invalid={!!errors.username}
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
                <Field>
                  <FieldLabel htmlFor="temporaryPassword">
                    Temporary Password
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input
                        id="temporaryPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                        aria-invalid={!!errors.temporaryPassword}
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

            <div className="flex flex-col gap-2">
              <Button className="w-full" type="submit" disabled={isPending}>
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
        </form>
      </CardContent>
    </Card>
  );
};

export default StaffOnboardingForm;
