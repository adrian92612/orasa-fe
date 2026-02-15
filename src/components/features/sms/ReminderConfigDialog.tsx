import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import {
  useCreateReminderConfig,
  useUpdateReminderConfig,
} from "@/hooks/useSms";

import type { ReminderConfigResponse } from "@/types/sms";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { PREDEFINED_TEMPLATES } from "@/constants/sms";

const reminderConfigSchema = z
  .object({
    hours: z.string().optional(),
    minutes: z.string().optional(),
    messageTemplate: z.string().min(1, "Message template is required"),
    enabled: z.boolean(),
  })
  .refine(
    (data) => Number(data.hours || 0) > 0 || Number(data.minutes || 0) > 0,
    {
      message: "At least one of hours or minutes must be greater than 0",
      path: ["minutes"],
    },
  );

type FormValues = z.infer<typeof reminderConfigSchema>;

type ReminderConfigDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: ReminderConfigResponse | null;
};

const ReminderConfigDialog = ({
  open,
  onOpenChange,
  config,
}: ReminderConfigDialogProps) => {
  const isEditing = !!config;

  const createMutation = useCreateReminderConfig();
  const updateMutation = useUpdateReminderConfig();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(reminderConfigSchema),
    defaultValues: {
      hours: "1",
      minutes: "0",
      messageTemplate: PREDEFINED_TEMPLATES[0].content,
      enabled: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (config && config.leadTimeMinutes != null) {
        const hours = Math.floor(config.leadTimeMinutes / 60).toString();
        const minutes = (config.leadTimeMinutes % 60).toString();
        const templateMatch =
          PREDEFINED_TEMPLATES.find((t) => t.content === config.messageTemplate)
            ?.content || PREDEFINED_TEMPLATES[0].content;

        reset({
          hours,
          minutes,
          messageTemplate: templateMatch,
          enabled: config.enabled,
        });
      } else {
        reset({
          hours: "1",
          minutes: "0",
          messageTemplate: PREDEFINED_TEMPLATES[0].content,
          enabled: true,
        });
      }
    }
  }, [open, config, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormValues) => {
    const leadTimeMinutes =
      Number(data.hours || 0) * 60 + Number(data.minutes || 0);

    if (isEditing && config) {
      updateMutation.mutate({
        id: config.id,
        data: {
          leadTimeMinutes,
          messageTemplate: data.messageTemplate,
          enabled: data.enabled,
        },
      });
    } else {
      createMutation.mutate({
        leadTimeMinutes,
        messageTemplate: data.messageTemplate,
        enabled: data.enabled,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Reminder" : "Add Reminder"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the reminder settings."
              : "Configure when and what to send as an SMS reminder."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="hours">Reminder Timing</FieldLabel>
              <FieldContent>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor="hours"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Hours
                    </label>
                    <Controller
                      control={control}
                      name="hours"
                      render={({ field, fieldState }) => (
                        <Input
                          id="hours"
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                              field.onChange(val);
                            }
                          }}
                          aria-invalid={!!fieldState.error}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor="minutes"
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Minutes
                    </label>
                    <Controller
                      control={control}
                      name="minutes"
                      render={({ field, fieldState }) => (
                        <Input
                          id="minutes"
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                              field.onChange(val);
                            }
                          }}
                          aria-invalid={!!fieldState.error}
                        />
                      )}
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  How long before the appointment to send the reminder.
                </p>
                <Controller
                  control={control}
                  name="minutes"
                  render={({ fieldState }) => (
                    <>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </>
                  )}
                />
              </FieldContent>
            </Field>

            <Controller
              control={control}
              name="messageTemplate"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="message-template">
                    Message Template
                  </FieldLabel>
                  <FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="message-template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_TEMPLATES.map((t) => (
                          <SelectItem key={t.id} value={t.content}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <div className="rounded-md bg-secondary/30 p-3 italic text-xs text-muted-foreground border border-dashed">
                        &quot;{field.value}&quot;
                      </div>
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
              name="enabled"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-base">Active</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      Whether this reminder is currently active and will be
                      sent.
                    </p>
                  </div>
                  <FieldContent>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
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
                "Add Reminder"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderConfigDialog;
