import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { smsService } from "@/services/sms.service";
import type { SmsLogSearchParams } from "@/types/sms";
import { Q_KEYS } from "@/constants/queryKeys";

export const useSmsLogs = (params: SmsLogSearchParams = {}) => {
  return useQuery({
    queryKey: [Q_KEYS.SMS_LOGS, params],
    queryFn: async () => {
      return smsService.getSmsLogs(params);
    },
  });
};

export const useSuspenseSmsLogs = (params: SmsLogSearchParams = {}) => {
  return useSuspenseQuery({
    queryKey: [Q_KEYS.SMS_LOGS, params],
    queryFn: async () => {
      return smsService.getSmsLogs(params);
    },
    // SMS logs are immutable, cache for 1 minute
    staleTime: 60 * 1000,
  });
};
