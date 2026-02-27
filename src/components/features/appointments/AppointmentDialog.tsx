import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AppointmentResponse,
  AppointmentStatus,
} from "@/types/appointment";
import LoadingButton from "@/components/common/LoadingButton";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks/useAppointments";
import { useUser } from "@/context/UserContext";
import { isValidPHPhone } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useBranchServices } from "@/hooks/useServices";
import { useReminders } from "@/hooks/useReminders";
import { useBranches } from "@/hooks/useBranches";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, sub, isSameDay } from "date-fns";
import { PREDEFINED_TEMPLATES } from "@/constants/sms";

const formatDuration = (minutes: number) => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  const parts = [];
  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (mins) parts.push(`${mins} min`);
  return parts.join(" ") || "0 min";
};

const appointmentSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z
    .string()
    .trim()
    .min(1, "Customer phone is required")
    .refine(
      isValidPHPhone,
      "Phone number must start with 09 and be 11 digits long",
    ),
  branchId: z.string().min(1, "Branch is required"),
  startDateTime: z.date({ message: "Start time is required" }),
  endDateTime: z.date().optional(),
  isWalkin: z.boolean(),
  serviceId: z.string().min(1, "Service is required"),
  selectedReminderIds: z.array(z.string()).optional(),
  notes: z.string().trim().optional(),
  reminderLeadTimeHours: z.string().optional(),
  reminderLeadTimeMinutes: z.string().optional(),
  additionalReminderMinutes: z.number().optional(),
  customReminderEnabled: z.boolean().optional(),
  additionalReminderTemplate: z.string().trim().optional(),
  status: z
    .enum(["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"])
    .optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

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
  // Use passed branchId prop or context branchId.
  // If neither matches (e.g. "All Branches" selected), this will be null.
  const initialBranchId = propBranchId || selectedBranchId;

  const { data: branches = [] } = useBranches();

  // We need to fetch services for the *selected* branch in the form,
  // not necessarily the initialBranchId if it was null.
  const isEditing = !!appointmentToEdit;

  const createMutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();

  const [openCombobox, setOpenCombobox] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { dirtyFields },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      branchId: initialBranchId || "",
      // Date fields are undefined initially for react-hook-form when using Date objects
      isWalkin: false,
      serviceId: "",
      selectedReminderIds: [],
      notes: "",
      additionalReminderMinutes: 0,
      customReminderEnabled: false,
      additionalReminderTemplate: PREDEFINED_TEMPLATES[0].content,
      status: "PENDING",
    },
  });

  const isWalkin = useWatch({ control, name: "isWalkin" });
  const startDateTime = useWatch({ control, name: "startDateTime" });
  const serviceId = useWatch({ control, name: "serviceId" });
  const watchedBranchId = useWatch({ control, name: "branchId" }); // Watch branch selection

  // Fetch services for the currently engaged branch (either prop or selected in form)
  const effectiveBranchId = watchedBranchId || initialBranchId;
  const { data: branchServices = [] } = useBranchServices(effectiveBranchId);
  const { data: reminders = [] } = useReminders(user?.businessId);

  useEffect(() => {
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
        branchId: appointmentToEdit.branchId, // Ensure branchId is set when editing
        startDateTime: new Date(appointmentToEdit.startDateTime),
        endDateTime: appointmentToEdit.endDateTime
          ? new Date(appointmentToEdit.endDateTime)
          : undefined,
        isWalkin: appointmentToEdit.type === "WALK_IN",
        serviceId: appointmentToEdit.serviceId || "",
        selectedReminderIds: appointmentToEdit.selectedReminderIds || [],
        notes: appointmentToEdit.notes || "",
        reminderLeadTimeHours: hours.toString(),
        reminderLeadTimeMinutes: minutesValue.toString(),
        additionalReminderMinutes:
          appointmentToEdit.additionalReminderMinutes || 0,
        customReminderEnabled: !!appointmentToEdit.additionalReminderMinutes,
        additionalReminderTemplate:
          appointmentToEdit.additionalReminderTemplate || "",
        status: appointmentToEdit.status,
      });
    } else {
      reset({
        customerName: "",
        customerPhone: "",
        branchId: initialBranchId || "",
        startDateTime: undefined,
        endDateTime: undefined,
        isWalkin: false,
        serviceId: "",
        selectedReminderIds: [],
        notes: "",
        reminderLeadTimeHours: "",
        reminderLeadTimeMinutes: "",
        additionalReminderMinutes: 0,
        customReminderEnabled: false,
        additionalReminderTemplate: PREDEFINED_TEMPLATES[0].content,
        status: "PENDING",
      });
    }
  }, [appointmentToEdit, reset, open, initialBranchId]);

  // Restore deleted effects
  useEffect(() => {
    if (
      !isEditing &&
      open &&
      reminders.length > 0 &&
      !dirtyFields.selectedReminderIds
    ) {
      const defaults = reminders.filter((r) => r.enabled).map((r) => r.id);
      setValue("selectedReminderIds", defaults);
    }
  }, [reminders, open, isEditing, setValue, dirtyFields.selectedReminderIds]);

  const customReminderEnabled = useWatch({
    control,
    name: "customReminderEnabled",
  });

  useEffect(() => {
    if (startDateTime && serviceId) {
      const service = branchServices.find((s) => s.serviceId === serviceId);
      if (service) {
        const start = new Date(startDateTime);
        const end = new Date(start.getTime() + service.durationMinutes * 60000);
        setValue("endDateTime", end);
      }
    }
  }, [startDateTime, serviceId, branchServices, setValue]);

  useEffect(() => {
    if (isWalkin) {
      const today = new Date();
      if (!startDateTime) {
        setValue("startDateTime", today);
      } else if (!isSameDay(startDateTime, today)) {
        const newDate = new Date();
        newDate.setHours(startDateTime.getHours());
        newDate.setMinutes(startDateTime.getMinutes());
        setValue("startDateTime", newDate);
      }
    }
  }, [isWalkin, startDateTime, setValue]);

  const onSubmit = (data: AppointmentFormValues) => {
    if (!user?.businessId) return;

    // Use data.branchId which should be populated now either from prop default or user selection
    const targetBranchId = data.branchId;

    if (!targetBranchId) {
      // Should be caught by validation schema, but extra safety
      return;
    }

    const additionalReminderValue = data.customReminderEnabled
      ? Number(data.reminderLeadTimeHours || 0) * 60 +
        Number(data.reminderLeadTimeMinutes || 0)
      : 0;

    const payload = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      startDateTime: data.startDateTime.toISOString(),
      endDateTime: data.endDateTime
        ? data.endDateTime.toISOString()
        : data.startDateTime.toISOString(),
      status: data.status as AppointmentStatus,
      serviceId: data.serviceId,
      selectedReminderIds: data.selectedReminderIds,
      notes: data.notes,
      additionalReminderMinutes: additionalReminderValue,
      additionalReminderTemplate: data.customReminderEnabled
        ? data.additionalReminderTemplate
        : undefined,
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
      <DialogContent className="sm:max-w-[500px]">
        {/* ... Header ... */}
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update appointment details or status."
              : "Create a new appointment."}
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
                        onValueChange={field.onChange}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {/* Walk-in Switch */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="isWalkin">
                    Walk-in Appointment
                  </FieldLabel>
                  {isEditing && (
                    <span className="text-xs text-muted-foreground">
                      Type cannot be changed
                    </span>
                  )}
                </div>
                <Controller
                  name="isWalkin"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isWalkin"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isEditing}
                    />
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
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="John Doe"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Service + Start Time */}

              <Controller
                name="serviceId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Service</FieldLabel>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className={cn(
                            "w-full justify-between font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? (branchServices.find(
                                (s) => s.serviceId === field.value,
                              )?.serviceName ??
                              (appointmentToEdit?.serviceDeleted
                                ? "⚠ Service was deleted — select a new one"
                                : "Select a service"))
                            : "Select a service"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search service..." />
                          <CommandList>
                            <CommandEmpty>No service found.</CommandEmpty>
                            <CommandGroup>
                              {branchServices
                                .filter((s) => s.active)
                                .map((service) => (
                                  <CommandItem
                                    key={service.serviceId}
                                    value={service.serviceName}
                                    onSelect={() => {
                                      field.onChange(service.serviceId);
                                      setOpenCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        service.serviceId === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {service.serviceName} (
                                    {service.durationMinutes} min)
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                              "grow justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                                return !isSameDay(date, today);
                              }
                              return date < sub(today, { days: 1 });
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        className="w-[130px] shrink-0"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const time = e.target.value;
                          if (time) {
                            const [hours, minutes] = time
                              .split(":")
                              .map(Number);
                            const newDate = new Date(field.value || new Date());
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);

                            if (newDate >= new Date()) {
                              field.onChange(newDate);
                            }
                          }
                        }}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="hidden">
                <Controller
                  name="endDateTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ? field.value.toISOString() : ""}
                      type="hidden"
                    />
                  )}
                />
              </div>

              {/* Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Any special instructions..."
                    />
                  </Field>
                )}
              />

              {/* Reminders */}
              {!isWalkin && reminders.length > 0 && (
                <div className="space-y-4 rounded-md border p-4">
                  <div className="text-sm font-medium">Reminders</div>
                  <Controller
                    name="selectedReminderIds"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {reminders
                          .filter((r) => r.enabled)
                          .map((reminder) => (
                            <div
                              key={reminder.id}
                              className="flex items-start space-x-2"
                            >
                              <Checkbox
                                id={reminder.id}
                                checked={field.value?.includes(reminder.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  const updated = checked
                                    ? [...current, reminder.id]
                                    : current.filter(
                                        (id) => id !== reminder.id,
                                      );
                                  field.onChange(updated);
                                }}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={reminder.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {formatDuration(reminder.leadTimeMinutes)}{" "}
                                  before
                                </Label>
                              </div>
                            </div>
                          ))}
                      </div>
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
                      <Checkbox
                        id="customReminderEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
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
                <div className="space-y-4 rounded-md border p-4 bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-sm font-medium">
                    Extra Reminder Settings
                  </div>
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
                              if (val === "" || /^\d+$/.test(val))
                                field.onChange(val);
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
                              if (val === "" || /^\d+$/.test(val))
                                field.onChange(val);
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
            </FieldGroup>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
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
