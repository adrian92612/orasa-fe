import { useQuery } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { Q_KEYS } from "@/constants/queryKeys";

export function useServices() {
  return useQuery({
    queryKey: [Q_KEYS.SERVICES],
    queryFn: async () => {
      const response = await serviceService.getServices();
      return response.data;
    },
  });
}
