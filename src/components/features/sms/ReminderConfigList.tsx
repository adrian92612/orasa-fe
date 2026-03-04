import { useState, Suspense } from "react";
import { Bell, Plus } from "lucide-react";

import { useDeleteReminderConfig, useSuspenseReminderConfigs } from "@/hooks/useSms";

import type { ReminderConfigResponse } from "@/types/sms";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import ReminderConfigCard from "@/components/features/sms/ReminderConfigCard";
import ReminderConfigDialog from "@/components/features/sms/ReminderConfigDialog";
import { ReminderConfigListSkeleton } from "@/components/features/sms/ReminderConfigListSkeleton";

type ReminderConfigItemsProps = {
  onEdit: (config: ReminderConfigResponse) => void;
  onDelete: (config: ReminderConfigResponse) => void;
};

const ReminderConfigItems = ({ onEdit, onDelete }: ReminderConfigItemsProps) => {
  const { data: configs } = useSuspenseReminderConfigs();

  const sortedConfigs = Array.isArray(configs)
    ? [...configs].sort((a, b) => (a.leadTimeMinutes ?? 0) - (b.leadTimeMinutes ?? 0))
    : [];

  if (sortedConfigs.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Bell className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="font-semibold text-lg">No reminders configured</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first reminder to automatically notify customers before their appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedConfigs.map((config) => (
        <ReminderConfigCard key={config.id} config={config} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

const ReminderConfigList = () => {
  const deleteMutation = useDeleteReminderConfig();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ReminderConfigResponse | null>(null);
  const [deletingConfig, setDeletingConfig] = useState<ReminderConfigResponse | null>(null);

  const handleEdit = (config: ReminderConfigResponse) => {
    setEditingConfig(config);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingConfig(null);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingConfig) return;
    deleteMutation.mutate(deletingConfig.id, {
      onSuccess: () => setDeletingConfig(null),
    });
  };

  const formatLeadTimeShort = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = minutes / 60;
    if (minutes % 60 === 0) return `${hours}h`;
    return `${Math.floor(hours)}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">SMS Reminders</h2>
          <p className="text-sm text-muted-foreground">Configure when appointment reminders are sent via SMS.</p>
        </div>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <Suspense fallback={<ReminderConfigListSkeleton />}>
        <ReminderConfigItems onEdit={handleEdit} onDelete={setDeletingConfig} />
      </Suspense>

      <ReminderConfigDialog open={dialogOpen} onOpenChange={setDialogOpen} config={editingConfig} />

      <AlertDialog open={!!deletingConfig} onOpenChange={(open) => !open && setDeletingConfig(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the{" "}
              <span className="font-semibold text-foreground">
                {deletingConfig && formatLeadTimeShort(deletingConfig.leadTimeMinutes)}
              </span>{" "}
              reminder. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReminderConfigList;
