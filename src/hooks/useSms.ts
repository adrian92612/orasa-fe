import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { smsService } from "@/services/sms.service";
import { Q_KEYS } from "@/constants/queryKeys";

import type {
  CreateReminderConfigRequest,
  ReminderConfigResponse,
  UpdateReminderConfigRequest,
} from "@/types/sms";

export const useReminderConfigs = () => {
  return useQuery({
    queryKey: [Q_KEYS.REMINDER_CONFIGS],
    queryFn: smsService.getReminderConfigs,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReminderConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReminderConfigRequest) =>
      smsService.createReminderConfig(data),
    onMutate: async (newConfig) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });

      const previous = queryClient.getQueryData<ReminderConfigResponse[]>([
        Q_KEYS.REMINDER_CONFIGS,
      ]);

      const optimistic: ReminderConfigResponse = {
        id: `temp-${Date.now()}`,
        businessId: "",
        leadTimeMinutes: newConfig.leadTimeMinutes,
        messageTemplate: newConfig.messageTemplate,
        enabled: newConfig.enabled ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ReminderConfigResponse[]>(
        [Q_KEYS.REMINDER_CONFIGS],
        (old = []) => [...old, optimistic],
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.REMINDER_CONFIGS], context.previous);
      }
      toast.error("Failed to create reminder config");
    },
    onSuccess: () => {
      toast.success("Reminder config created");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });
    },
  });
};

export const useUpdateReminderConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateReminderConfigRequest;
    }) => smsService.updateReminderConfig(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });

      const previous = queryClient.getQueryData<ReminderConfigResponse[]>([
        Q_KEYS.REMINDER_CONFIGS,
      ]);

      queryClient.setQueryData<ReminderConfigResponse[]>(
        [Q_KEYS.REMINDER_CONFIGS],
        (old = []) =>
          old.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...(data.leadTimeMinutes !== undefined && {
                    leadTimeMinutes: data.leadTimeMinutes,
                  }),
                  ...(data.messageTemplate !== undefined && {
                    messageTemplate: data.messageTemplate,
                  }),
                  ...(data.enabled !== undefined && {
                    enabled: data.enabled,
                  }),
                  updatedAt: new Date().toISOString(),
                }
              : c,
          ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.REMINDER_CONFIGS], context.previous);
      }
      toast.error("Failed to update reminder config");
    },
    onSuccess: () => {
      toast.success("Reminder config updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });
    },
  });
};

export const useDeleteReminderConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => smsService.deleteReminderConfig(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });

      const previous = queryClient.getQueryData<ReminderConfigResponse[]>([
        Q_KEYS.REMINDER_CONFIGS,
      ]);

      queryClient.setQueryData<ReminderConfigResponse[]>(
        [Q_KEYS.REMINDER_CONFIGS],
        (old = []) => old.filter((c) => c.id !== id),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([Q_KEYS.REMINDER_CONFIGS], context.previous);
      }
      toast.error("Failed to delete reminder config");
    },
    onSuccess: () => {
      toast.success("Reminder config deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [Q_KEYS.REMINDER_CONFIGS],
      });
    },
  });
};
