import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { useCreateService } from "@/hooks/useServices";

import { serviceOnboardingSchema, type ServiceOnboardingValues } from "@/schemas/onboarding.schema";

type ServiceOnboardingFormProps = {
  onNext: () => void;
};

const ServiceOnboardingForm = ({ onNext }: ServiceOnboardingFormProps) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(serviceOnboardingSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      durationMinutes: 30,
    },
  });

  const { mutate: createService, isPending } = useCreateService();

  const onSubmit = (data: ServiceOnboardingValues) => {
    createService(data, {
      onSuccess: () => {
        onNext();
      },
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Add Your First Service</CardTitle>
        <CardDescription>Create a service to get started, or skip this step.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name" required>
                      Service Name
                    </FieldLabel>
                    <FieldContent>
                      <Input id="name" placeholder="e.g. Basic Haircut" {...field} aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <FieldContent>
                      <Input
                        id="description"
                        placeholder="e.g. Standard consultation"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="basePrice"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="basePrice" required>
                      Base Price
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="basePrice"
                        type="number"
                        placeholder="0.00"
                        {...field}
                        value={field.value as string | number | undefined}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="durationMinutes"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="durationMinutes" required>
                      Duration (min)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="durationMinutes"
                        type="number"
                        placeholder="30"
                        {...field}
                        value={field.value as string | number | undefined}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldContent>
                  </Field>
                )}
              />

              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full" type="submit">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Service...
                    </>
                  ) : (
                    "Create & Continue"
                  )}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={onNext} disabled={isPending}>
                  Skip for now
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceOnboardingForm;
