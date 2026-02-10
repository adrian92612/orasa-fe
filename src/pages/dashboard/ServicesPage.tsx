import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useServices,
  useBranchServices,
  useAssignServiceToBranch,
  useUpdateServiceLink,
} from "@/hooks/useServices";
import ServiceList from "@/components/features/services/ServiceList";
import ServiceSearch from "@/components/features/services/ServiceSearch";
import ServicePagination from "@/components/features/services/ServicePagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useBranches } from "@/hooks/useBranches";
import type { ServiceResponse, BranchServiceResponse } from "@/types/service";

const ServiceDialog = lazy(
  () => import("@/components/features/services/ServiceDialog"),
);
const ServiceDeleteDialog = lazy(
  () => import("@/components/features/services/ServiceDeleteDialog"),
);

const ServicesPage = () => {
  const { selectedBranchId, user } = useUser();
  const { data: branches = [] } = useBranches();
  const hasMultipleBranches = branches.length > 1;

  const { data: allServices = [], isLoading: isLoadingAll } = useServices(null);

  const { data: branchServices = [], isLoading: isLoadingBranch } =
    useBranchServices(selectedBranchId);

  const assignService = useAssignServiceToBranch();
  const updateServiceLink = useUpdateServiceLink();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const activeServices: ServiceResponse[] = [];
  const inactiveServices: ServiceResponse[] = [];

  if (selectedBranchId) {
    const activeServiceIds = new Set<string>();
    const serviceLinkMap = new Map<string, string>();
    const branchServiceMap = new Map<string, BranchServiceResponse>();

    branchServices.forEach((bs: BranchServiceResponse) => {
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

    allServices.forEach((s) => {
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
    activeServices.push(...allServices);
  }

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

  const handleCreate = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

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

  const isLoading = isLoadingAll || isLoadingBranch;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Manage your service offerings and pricing.
        </p>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <ServiceSearch value={searchQuery} onChange={handleSearchChange} />

      <div className="min-h-[400px] space-y-8">
        {selectedBranchId ? (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="active">
                Active
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {filteredActive.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="other">
                Other
                <span className="ml-2 rounded-full bg-muted-foreground/10 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {filteredInactive.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6 space-y-4">
              <ServiceList
                services={paginatedActive}
                isLoading={isLoading}
                isSearchActive={!!searchQuery.trim()}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                emptyTitle="No active services"
                emptyDescription="Select services from the 'Other' tab to activate them for this branch."
              />
              <ServicePagination
                totalItems={filteredActive.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabsContent>

            <TabsContent value="other" className="mt-6 space-y-4">
              <ServiceList
                services={paginatedInactive}
                isLoading={isLoading}
                isSearchActive={!!searchQuery.trim()}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                emptyTitle="No other services found"
                emptyDescription="All services are currently active for this branch."
              />
              <ServicePagination
                totalItems={filteredInactive.length}
                pageSize={pageSize}
                currentPage={otherCurrentPage}
                onPageChange={setOtherCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <ServiceList
              services={paginatedActive} // Contains all services in this case
              isLoading={isLoading}
              isSearchActive={!!searchQuery.trim()}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ServicePagination
              totalItems={filteredActive.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      <Suspense fallback={null}>
        <ServiceDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          serviceToEdit={selectedService}
          branchId={hasMultipleBranches ? selectedBranchId : null}
        />

        <ServiceDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          service={selectedService}
        />
      </Suspense>
    </div>
  );
};

export default ServicesPage;
