import { useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import { useSuspenseServices } from "@/hooks/useServices";
import { Q_KEYS } from "@/constants/queryKeys";
import type { 
  ServiceResponse, 
  UpdateServiceRequest 
} from "@/types/service";

type ServiceMutationVariables = 
  | string 
  | { id: string; data: UpdateServiceRequest };

// Hook for UI state that doesn't trigger suspense
export const useServicesState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setCurrentPage(1);
  };

  return {
    searchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
  };
};

// Hook for data fetching and processing that triggers suspense
export const useServicesData = (state: ReturnType<typeof useServicesState>) => {
  const { searchQuery, currentPage, pageSize } = state;

  const { data: allServices } = useSuspenseServices(null);

  const pendingMutations = useMutationState({
    filters: { status: "pending", mutationKey: [Q_KEYS.SERVICES] },
    select: (mutation) => mutation.state.variables as ServiceMutationVariables,
  });

  const checkIsSaving = (id: string) =>
    pendingMutations.some((vars) => {
      if (typeof vars === "string") return vars === id;
      if (!vars) return false;
      
      // UpdateService variables check
      if ("id" in vars && vars.id === id) return true;
      
      return false;
    });

  const safeAllServices = allServices || [];

  // --- Filter & paginate ---
  const filterList = (list: ServiceResponse[]) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return list;
    return list.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(query);
      const descMatch = s.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
  };

  const filteredServices = filterList(safeAllServices);

  const start = (currentPage - 1) * pageSize;
  const paginatedServices = filteredServices.slice(start, start + pageSize);

  return {
    checkIsSaving,
    filteredServices,
    paginatedServices,
  };
};

