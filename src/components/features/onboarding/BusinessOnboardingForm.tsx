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
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const onboardingSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  branchAddress: z.string().min(1, "Branch address is required"),
  branchPhone: z.string().min(1, "Branch phone number is required"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

type BusinessResponse = {
  id: string;
  name: string;
  slug: string;
  freeSmsCredits: number;
  paidSmsCredits: number;
  subscriptionStatus: string;
  createdAt: string;
  firstBranchId: string;
};

type CreateBusinessRequest = {
  name: string;
  branch: {
    name: string;
    address: string;
    phoneNumber: string;
  };
};

type BusinessOnboardingFormProps = {
  onSuccess: (firstBranchId: string) => void;
};

const BusinessOnboardingForm = ({ onSuccess }: BusinessOnboardingFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      branchName: "",
      branchAddress: "",
      branchPhone: "",
    },
  });

  const { mutate: createBusiness, isPending } = useMutation({
    mutationFn: async (data: OnboardingValues) => {
      const result = await apiClient.post<
        BusinessResponse,
        CreateBusinessRequest
      >(API_ROUTES.BUSINESSES.CREATE, {
        name: data.businessName,
        branch: {
          name: data.branchName,
          address: data.branchAddress,
          phoneNumber: data.branchPhone,
        },
      });
      return result;
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        onSuccess(result.data.firstBranchId);
      } else {
        console.error("Onboarding failed:", result);
      }
    },
    onError: (error) => {
      console.error("Error submitting onboarding form:", error);
    },
  });

  const onSubmit = (data: OnboardingValues) => {
    createBusiness(data);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Welcome to Orasa</CardTitle>
        <CardDescription>
          Let's set up your business and main branch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldLegend>Business Details</FieldLegend>
            <Controller
              control={control}
              name="businessName"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="businessName"
                      placeholder="e.g. Orasa Clinic"
                      {...field}
                      aria-invalid={!!errors.businessName}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            <FieldSeparator />

            <FieldLegend>Main Branch Details</FieldLegend>
            <Controller
              control={control}
              name="branchName"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="branchName">Branch Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="branchName"
                      placeholder="e.g. Main Branch"
                      {...field}
                      aria-invalid={!!errors.branchName}
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
              name="branchAddress"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="branchAddress">
                    Branch Address
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="branchAddress"
                      placeholder="e.g. 123 Main St, City"
                      {...field}
                      aria-invalid={!!errors.branchAddress}
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
              name="branchPhone"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="branchPhone">
                    Branch Phone No.
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="branchPhone"
                      placeholder="e.g. 09123456789"
                      {...field}
                      aria-invalid={!!errors.branchPhone}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Next Step"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessOnboardingForm;
