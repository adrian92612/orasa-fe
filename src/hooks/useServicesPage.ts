import { useState } from "react";
import { useMutationState } from "@tanstack/react-query";
import {
  useSuspenseServices,
  useSuspenseBranchServices,
  useAssignServiceToBranch,
  useUpdateServiceLink,
} from "@/hooks/useServices";
import { useUser } from "@/context/UserContext";
import { Q_KEYS } from "@/constants/queryKeys";
import type { ServiceResponse, BranchServiceResponse } from "@/types/service";

// Hook for UI state that doesn't trigger suspense
export const useServicesState = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    setOtherCurrentPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setCurrentPage(1);
    setOtherCurrentPage(1);
  };

  return {
    searchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    otherCurrentPage,
    setOtherCurrentPage,
    pageSize,
    handlePageSizeChange,
  };
};

// Hook for data fetching and processing that triggers suspense
export const useServicesData = (state: ReturnType<typeof useServicesState>) => {
  const { selectedBranchId, user } = useUser();
  const { searchQuery, currentPage, otherCurrentPage, pageSize } = state;

  const { data: allServices } = useSuspenseServices(null);
  const { data: branchServices } = useSuspenseBranchServices(selectedBranchId);

  const assignService = useAssignServiceToBranch();
  const updateServiceLink = useUpdateServiceLink();

  const pendingMutations = useMutationState({
    filters: { status: "pending", mutationKey: [Q_KEYS.SERVICES] },
    select: (mutation) => mutation.state.variables as any,
  });

  const checkIsSaving = (id: string) =>
    pendingMutations.some((vars) => {
      if (typeof vars === "string") return vars === id;
      return vars?.id === id || vars?.data?.serviceId === id;
    });

  // --- Categorize services ---
  const activeServices: ServiceResponse[] = [];
  const inactiveServices: ServiceResponse[] = [];

  const safeBranchServices = branchServices || [];
  const safeAllServices = allServices || [];

  if (selectedBranchId) {
    const activeServiceIds = new Set<string>();
    const serviceLinkMap = new Map<string, string>();
    const branchServiceMap = new Map<string, BranchServiceResponse>();

    safeBranchServices.forEach((bs: BranchServiceResponse) => {
      serviceLinkMap.set(bs.serviceId, bs.id);
      branchServiceMap.set(bs.serviceId, bs);
      if (bs.active) {
        activeServiceIds.add(bs.serviceId);
        activeServices.push({
          id: bs.serviceId,
          businessId: user?.businessId || "",
          name: bs.serviceName,
          description: bs.serviceDescription,
          basePrice: bs.basePrice,
          customPrice: bs.customPrice,
          effectivePrice: bs.effectivePrice,
          durationMinutes: bs.durationMinutes,
          createdAt: bs.createdAt,
          updatedAt: bs.createdAt,
          isActive: true,
          linkId: bs.id,
        });
      }
    });

    safeAllServices.forEach((s) => {
      if (!activeServiceIds.has(s.id)) {
        const existingLinkId = serviceLinkMap.get(s.id);
        const branchService = branchServiceMap.get(s.id);

        inactiveServices.push({
          ...s,
          isActive: false,
          linkId: existingLinkId,
          customPrice: branchService?.customPrice,
          effectivePrice: branchService?.effectivePrice,
        });
      }
    });
  } else {
    activeServices.push(...safeAllServices);
  }

  // --- Toggle handler ---
  const handleToggleActive = (service: ServiceResponse) => {
    if (!selectedBranchId) return;

    if (service.isActive) {
      if (service.linkId) {
        updateServiceLink.mutate({
          branchId: selectedBranchId,
          linkId: service.linkId,
          data: {
            serviceId: service.id,
            active: false,
          },
        });
      }
    } else {
      if (service.linkId) {
        updateServiceLink.mutate({
          branchId: selectedBranchId,
          linkId: service.linkId,
          data: {
            serviceId: service.id,
            active: true,
          },
        });
      } else {
        assignService.mutate({
          branchId: selectedBranchId,
          data: {
            serviceId: service.id,
            active: true,
          },
        });
      }
    }
  };

  // --- Filter & paginate ---
  const filterList = (list: ServiceResponse[]) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return list;
    return list.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(query);
      const descMatch = s.description?.toLowerCase().includes(query);
      const priceMatch = s.basePrice.toString().includes(query);
      return nameMatch || descMatch || priceMatch;
    });
  };

  const filteredActive = filterList(activeServices);
  const filteredInactive = filterList(inactiveServices);

  const start = (currentPage - 1) * pageSize;
  const paginatedActive = filteredActive.slice(start, start + pageSize);

  const startOther = (otherCurrentPage - 1) * pageSize;
  const paginatedInactive = filteredInactive.slice(
    startOther,
    startOther + pageSize,
  );

  return {
    selectedBranchId,
    checkIsSaving,
    filteredActive,
    filteredInactive,
    paginatedActive,
    paginatedInactive,
    handleToggleActive,
  };
};
