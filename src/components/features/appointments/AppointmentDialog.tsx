import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormValues } from "@/schemas/appointment.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeInput } from "@/components/ui/time-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import LoadingButton from "@/components/common/LoadingButton";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { useUser } from "@/context/UserContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useServices } from "@/hooks/useServices";
import { useReminders } from "@/hooks/useReminders";
import { useBranches } from "@/hooks/useBranches";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, sub } from "date-fns";
import { PREDEFINED_TEMPLATES } from "@/constants/sms";

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentToEdit?: AppointmentResponse | null;
  branchId?: string | null;
};

const AppointmentDialog = ({
  open,
  onOpenChange,
  appointmentToEdit,
  branchId: propBranchId,
}: AppointmentDialogProps) => {
  const { user, selectedBranchId } = useUser();
  const initialBranchId = propBranchId || selectedBranchId;
  const { data: branches = [] } = useBranches();
  const isEditing = !!appointmentToEdit;

  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();

  const { control, handleSubmit, reset, setValue } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      branchId: initialBranchId || "",
      // Date fields are undefined initially for react-hook-form when using Date objects
      isWalkin: false,
      serviceIds: [],
      remindersEnabled: true,
      notes: "",
      additionalReminderMinutes: 0,
      customReminderEnabled: false,
      additionalReminderTemplate: PREDEFINED_TEMPLATES[0].content,
      status: "PENDING",
    },
  });

  const isWalkin = useWatch({ control, name: "isWalkin" });

  // Fetch all global services
  const { data: services = [] } = useServices();
  const { data: reminders = [] } = useReminders(user?.businessId);

  useEffect(() => {
    if (!open) return;

    if (appointmentToEdit) {
      const hours = appointmentToEdit.additionalReminderMinutes
        ? Math.floor(appointmentToEdit.additionalReminderMinutes / 60)
        : 0;
      const minutesValue = appointmentToEdit.additionalReminderMinutes
        ? appointmentToEdit.additionalReminderMinutes % 60
        : 0;
      reset({
        customerName: appointmentToEdit.customerName,
        customerPhone: appointmentToEdit.customerPhone,
        branchId: appointmentToEdit.branchId,
        startDateTime: new Date(appointmentToEdit.startDateTime),
        isWalkin: appointmentToEdit.type === "WALK_IN",
        serviceIds: appointmentToEdit.services?.map((s) => s.id) || [],
        remindersEnabled: appointmentToEdit.remindersEnabled ?? true,
        notes: appointmentToEdit.notes || "",
        reminderLeadTimeHours: hours.toString(),
        reminderLeadTimeMinutes: minutesValue.toString(),
        additionalReminderMinutes: appointmentToEdit.additionalReminderMinutes || 0,
        customReminderEnabled: !!appointmentToEdit.additionalReminderMinutes,
        additionalReminderTemplate: appointmentToEdit.additionalReminderTemplate || PREDEFINED_TEMPLATES[0].content,
        status: appointmentToEdit.status,
      });
    } else {
      reset({
        customerName: "",
        customerPhone: "",
        branchId: initialBranchId || "",
        startDateTime: new Date(),
        isWalkin: false,
        serviceIds: [],
        remindersEnabled: true,
        notes: "",
        reminderLeadTimeHours: "",
        reminderLeadTimeMinutes: "",
        additionalReminderMinutes: 0,
        customReminderEnabled: false,
        additionalReminderTemplate: PREDEFINED_TEMPLATES[0].content,
        status: "PENDING",
      });
    }
  }, [appointmentToEdit, reset, open, initialBranchId, reminders]);

  const customReminderEnabled = useWatch({
    control,
    name: "customReminderEnabled",
  });


  const onSubmit = (data: AppointmentFormValues) => {
    if (!user?.businessId) return;

    // Use data.branchId which should be populated now either from prop default or user selection
    const targetBranchId = data.branchId;

    if (!targetBranchId) {
      // Should be caught by validation schema, but extra safety
      return;
    }

    const additionalReminderValue = data.customReminderEnabled
      ? Number(data.reminderLeadTimeHours || 0) * 60 + Number(data.reminderLeadTimeMinutes || 0)
      : 0;

    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      startDateTime: data.startDateTime.toISOString(),
      status: data.status as AppointmentStatus,
      serviceIds: data.serviceIds,
      remindersEnabled: data.remindersEnabled,
      notes: data.notes,
      additionalReminderMinutes: additionalReminderValue,
      additionalReminderTemplate: data.customReminderEnabled ? data.additionalReminderTemplate : undefined,
    };

    if (isEditing && appointmentToEdit) {
      updateMutation.mutate({ id: appointmentToEdit.id, data: payload });
    } else {
      createMutation.mutate({
        businessId: user.businessId,
        branchId: targetBranchId,
        ...payload,
        isWalkin: data.isWalkin,
      });
    }
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Appointment" : "New Appointment"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update appointment details or status." : "Create a new appointment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <FieldSet disabled={isPending}>
            <FieldGroup>
              {/* Branch Selector (Only if no initialBranchId) */}
              {!initialBranchId && !isEditing && (
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel required>Branch</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Reset services whenever branch changes to prevent invalid selections
                          setValue("serviceIds", []);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {/* Walk-in Switch */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="isWalkin">Walk-in Appointment</FieldLabel>
                  {isEditing && <span className="text-xs text-muted-foreground">Type cannot be changed</span>}
                </div>
                <Controller
                  name="isWalkin"
                  control={control}
                  render={({ field }) => (
                    <Switch id="isWalkin" checked={field.value} onCheckedChange={field.onChange} disabled={isEditing} />
                  )}
                />
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="customerName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Customer Name
                      </FieldLabel>
                      <Input {...field} id={field.name} placeholder="John Doe" aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="customerPhone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} required>
                        Customer Phone
                      </FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="09123456789"
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d+$/.test(val)) {
                            if (val.length <= 11) {
                              field.onChange(val);
                            }
                          }
                        }}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              {/* Services Multi-Select */}
              <Controller
                name="serviceIds"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Services</FieldLabel>
                    <MultiSelect values={field.value} onValuesChange={field.onChange}>
                      <MultiSelectTrigger
                        className={cn(
                          "w-full dark:border-primary",
                          (!field.value || field.value.length === 0) && "text-muted-foreground",
                        )}
                      >
                        <MultiSelectValue placeholder="Select services" />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        search={{ placeholder: "Search services...", emptyMessage: "No service found." }}
                      >
                        <MultiSelectGroup>
                          {services
                            .map((service) => (
                              <MultiSelectItem
                                key={service.id}
                                value={service.id}
                                badgeLabel={service.name}
                              >
                                {service.name}
                              </MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="startDateTime"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Schedule
                    </FieldLabel>
                    <div className="w-full flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "grow justify-start text-left font-normal dark:bg-input/30 dark:border-primary",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const current = field.value || new Date();
                                const newDate = new Date(date);
                                newDate.setHours(current.getHours());
                                newDate.setMinutes(current.getMinutes());
                                field.onChange(newDate);
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              if (isWalkin) {
                                return false; // Allow any date for walk-ins
                              }
                              return date < sub(today, { days: 1 });
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <TimeInput
                        className="w-40 shrink-0 text-foreground dark:text-foreground"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(time) => {
                          if (time) {
                            const [hours, minutes] = time.split(":").map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);

                            if (isWalkin || newDate >= new Date()) {
                              field.onChange(newDate);
                            }
                          }
                        }}
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea {...field} id={field.name} placeholder="Any special instructions..." />
                  </Field>
                )}
              />

              {/* Reminders Toggle */}
              {!isWalkin && reminders.length > 0 && (
                <div className="flex items-center justify-between space-x-2 rounded-md border border-primary p-4">
                  <div className="flex flex-col gap-1">
                    <FieldLabel htmlFor="remindersEnabled">Send SMS Reminders</FieldLabel>
                    <span className="text-xs text-muted-foreground">Global reminder settings will be used</span>
                  </div>
                  <Controller
                    name="remindersEnabled"
                    control={control}
                    render={({ field }) => (
                      <Switch id="remindersEnabled" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              )}

              {/* Custom Reminder Toggle */}
              {!isWalkin && (
                <Controller
                  name="customReminderEnabled"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="customReminderEnabled" checked={field.value} onCheckedChange={field.onChange} />
                      <Label
                        htmlFor="customReminderEnabled"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Extra Reminder
                      </Label>
                    </div>
                  )}
                />
              )}

              {/* Extra Reminder Fields */}
              {!isWalkin && customReminderEnabled && (
                <div className="space-y-4 rounded-md border p-4 border-primary animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-sm font-medium text-foreground">Extra Reminder Settings</div>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="reminderLeadTimeHours"
                      control={control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Hours Before</FieldLabel>
                          <Input
                            placeholder="0"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d+$/.test(val)) field.onChange(val);
                            }}
                          />
                        </Field>
                      )}
                    />
                    <Controller
                      name="reminderLeadTimeMinutes"
                      control={control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Minutes Before</FieldLabel>
                          <Input
                            placeholder="0"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "" || /^\d+$/.test(val)) field.onChange(val);
                            }}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="additionalReminderTemplate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Message Template</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pick a template" />
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
                          <div className="rounded-md bg-muted p-2 italic text-[10px] text-muted-foreground border border-dashed">
                            &quot;{field.value || "No template selected"}&quot;
                          </div>
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              )}
            </FieldGroup>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={isPending}
                label={isEditing ? "Update Appointment" : "Create Appointment"}
                loadingLabel={isEditing ? "Updating..." : "Creating..."}
              />
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
