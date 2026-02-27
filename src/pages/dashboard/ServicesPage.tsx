import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ServiceList from "@/components/features/services/ServiceList";
import ServiceSearch from "@/components/features/services/ServiceSearch";
import CommonPagination from "@/components/common/CommonPagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useBranches } from "@/hooks/useBranches";
import { useServicesState, useServicesData } from "@/hooks/useServicesPage";
import type { ServiceResponse } from "@/types/service";
import { ServiceListSkeleton } from "@/components/features/services/ServiceListSkeleton";
import { CommonPaginationSkeleton } from "@/components/common/CommonPaginationSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceDialog = lazy(
  () => import("@/components/features/services/ServiceDialog"),
);
const ServiceDeleteDialog = lazy(
  () => import("@/components/features/services/ServiceDeleteDialog"),
);

const ServiceListSectionSkeleton = () => (
  <div className="space-y-8 mt-8">
    <Skeleton className="h-10 w-full lg:w-[400px]" />
    <div className="mt-6 space-y-4">
      <ServiceListSkeleton />
      <CommonPaginationSkeleton />
    </div>
  </div>
);

type ServiceListSectionProps = {
  state: ReturnType<typeof useServicesState>;
  onEdit: (service: ServiceResponse) => void;
  onDelete?: (service: ServiceResponse) => void;
};

const ServiceListSection = ({
  state,
  onEdit,
  onDelete,
}: ServiceListSectionProps) => {
  const {
    selectedBranchId,
    checkIsSaving,
    filteredActive,
    filteredInactive,
    paginatedActive,
    paginatedInactive,
    handleToggleActive,
  } = useServicesData(state);

  const {
    searchQuery,
    currentPage,
    setCurrentPage,
    otherCurrentPage,
    setOtherCurrentPage,
    pageSize,
    handlePageSizeChange,
  } = state;

  return (
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
              isSearchActive={!!searchQuery.trim()}
              checkIsSaving={checkIsSaving}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={handleToggleActive}
              emptyTitle="No active services"
              emptyDescription="Select services from the 'Other' tab to activate them for this branch."
            />
            <CommonPagination
              totalItems={filteredActive.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              itemName="active services"
            />
          </TabsContent>

          <TabsContent value="other" className="mt-6 space-y-4">
            <ServiceList
              services={paginatedInactive}
              isSearchActive={!!searchQuery.trim()}
              checkIsSaving={checkIsSaving}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={handleToggleActive}
              emptyTitle="No other services found"
              emptyDescription="All services are currently active for this branch."
            />
            <CommonPagination
              totalItems={filteredInactive.length}
              pageSize={pageSize}
              currentPage={otherCurrentPage}
              onPageChange={setOtherCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              itemName="other services"
            />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <ServiceList
            services={paginatedActive}
            isSearchActive={!!searchQuery.trim()}
            checkIsSaving={checkIsSaving}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <CommonPagination
            totalItems={filteredActive.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            itemName="services"
          />
        </>
      )}
    </div>
  );
};

const ServicesPage = () => {
  const { selectedBranchId, user } = useUser();
  const { data: branches = [] } = useBranches();
  const hasMultipleBranches = branches.length > 1;
  const state = useServicesState();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

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

      <ServiceSearch
        value={state.searchQuery}
        onChange={state.handleSearchChange}
      />

      <Suspense fallback={<ServiceListSectionSkeleton />}>
        <ServiceListSection
          state={state}
          onEdit={handleEdit}
          onDelete={user?.role === "OWNER" ? handleDelete : undefined}
        />
      </Suspense>

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
