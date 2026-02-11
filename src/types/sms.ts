export type ReminderConfigResponse = {
  id: string;
  businessId: string;
  leadTimeMinutes: number;
  messageTemplate: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateReminderConfigRequest = {
  leadTimeMinutes: number;
  messageTemplate: string;
  enabled?: boolean;
};

export type UpdateReminderConfigRequest = {
  leadTimeMinutes?: number;
  messageTemplate?: string;
  enabled?: boolean;
};
