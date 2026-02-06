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
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.coerce.number().min(1, "Price must be at least 1"),
  durationMinutes: z.coerce
    .number()
    .min(1, "Duration must be at least 1 minute"),
  availableGlobally: z.boolean(),
});

type ServiceValues = z.infer<typeof serviceSchema>;

type ServiceOnboardingFormProps = {
  onNext: () => void;
};

const ServiceOnboardingForm = ({ onNext }: ServiceOnboardingFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      durationMinutes: 30,
      availableGlobally: true,
    },
  });

  const { mutate: createService, isPending } = useMutation({
    mutationFn: async (data: ServiceValues) => {
      const result = await apiClient.post(API_ROUTES.SERVICES.CREATE, data);
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        onNext();
      } else {
        console.error("Service creation failed:", result);
      }
    },
    onError: (error) => {
      console.error("Error creating service:", error);
    },
  });

  const onSubmit = (data: ServiceValues) => {
    createService(data);
  };
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Add Your First Service</CardTitle>
        <CardDescription>
          Create a service to get started, or skip this step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="name">Service Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      placeholder="e.g. Basic Haircut"
                      {...field}
                      aria-invalid={!!errors.name}
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
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <FieldContent>
                    <Input
                      id="description"
                      placeholder="e.g. Standard consultation"
                      {...field}
                      aria-invalid={!!errors.description}
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
              name="basePrice"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="basePrice">Base Price</FieldLabel>
                  <FieldContent>
                    <Input
                      id="basePrice"
                      type="number"
                      placeholder="0.00"
                      {...field}
                      value={field.value as string | number | undefined}
                      aria-invalid={!!errors.basePrice}
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
              name="durationMinutes"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="durationMinutes">
                    Duration (min)
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="durationMinutes"
                      type="number"
                      placeholder="30"
                      {...field}
                      value={field.value as string | number | undefined}
                      aria-invalid={!!errors.durationMinutes}
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
              name="availableGlobally"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="availableGlobally"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <label
                    htmlFor="availableGlobally"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Available on all branches
                  </label>
                </div>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Service...
                  </>
                ) : (
                  "Create & Continue"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onNext}
                disabled={isPending}
              >
                Skip for now
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceOnboardingForm;
