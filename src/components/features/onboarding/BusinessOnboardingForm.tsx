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
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateBusiness } from "@/hooks/useBusiness";

const onboardingSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  branchAddress: z.string().min(1, "Branch address is required"),
  branchPhone: z.string().min(1, "Branch phone number is required"),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

type BusinessOnboardingFormProps = {
  onSuccess: (firstBranchId: string) => void;
};

const BusinessOnboardingForm = ({ onSuccess }: BusinessOnboardingFormProps) => {
  const { control, handleSubmit } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      branchName: "",
      branchAddress: "",
      branchPhone: "",
    },
  });

  const { mutate: createBusiness, isPending } = useCreateBusiness();

  const onSubmit = (data: OnboardingValues) => {
    createBusiness(
      {
        name: data.businessName,
        branch: {
          name: data.branchName,
          address: data.branchAddress,
          phoneNumber: data.branchPhone,
        },
      },
      {
        onSuccess: (result) => {
          onSuccess(result.firstBranchId);
        },
      },
    );
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <FieldLegend>Business Details</FieldLegend>
              <Controller
                control={control}
                name="businessName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="businessName">
                      Business Name
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="businessName"
                        placeholder="e.g. Orasa Clinic"
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

              <FieldSeparator />

              <FieldLegend>Main Branch Details</FieldLegend>
              <Controller
                control={control}
                name="branchName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="branchName">Branch Name</FieldLabel>
                    <FieldContent>
                      <Input
                        id="branchName"
                        placeholder="e.g. Main Branch"
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
                name="branchAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="branchAddress">
                      Branch Address
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="branchAddress"
                        placeholder="e.g. 123 Main St, City"
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
                name="branchPhone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="branchPhone">
                      Branch Phone No.
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="branchPhone"
                        placeholder="e.g. 09123456789"
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
              <div className="pt-4">
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
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessOnboardingForm;
