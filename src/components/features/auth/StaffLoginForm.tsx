import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field";
import { LogIn, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
import { APP_ROUTES, API_ROUTES } from "@/constants/routes";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { type AuthResponse } from "@/types/auth";

const staffLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type StaffLoginFormValues = z.infer<typeof staffLoginSchema>;

const StaffLoginForm = () => {
  const { refetchUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: StaffLoginFormValues) => {
      return await apiClient.post<AuthResponse, StaffLoginFormValues>(
        API_ROUTES.AUTH.LOGIN_STAFF,
        data,
      );
    },
    onSuccess: async (result) => {
      if (result.success) {
        await refetchUser();
        navigate(APP_ROUTES.DASHBOARD.APPOINTMENTS);
      } else {
        console.error("Login failed:", result);
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to login");
    },
  });

  const onSubmit = (data: StaffLoginFormValues) => {
    setError(null);
    login(data);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100 mb-4">
              {error}
            </div>
          )}

          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="username" required>
                  Username
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="h-11 border-slate-200 focus-visible:ring-black"
                    disabled={isPending}
                    aria-invalid={!!errors.username}
                    {...field}
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
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password" required>
                  Password
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 border-slate-200 focus-visible:ring-black"
                    disabled={isPending}
                    aria-invalid={!!errors.password}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Button
            className="w-full h-11 text-base bg-black hover:bg-slate-900 transition-colors shadow-lg shadow-black/5"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default StaffLoginForm;
