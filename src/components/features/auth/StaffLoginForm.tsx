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
            <div className="p-3 text-sm text-slate-200 bg-slate-900 rounded-md border border-slate-800 mb-4 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
              {error}
            </div>
          )}

          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  htmlFor="username"
                  required
                  className="text-backround"
                >
                  Username
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="h-11 bg-slate-900/50 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-400"
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
                <FieldLabel
                  htmlFor="password"
                  required
                  className="text-backround"
                >
                  Password
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 bg-slate-900/50 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-400"
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
            className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-lg shadow-primary/20"
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
