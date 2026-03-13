import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ServiceList from "@/components/features/services/ServiceList";
import ServiceSearch from "@/components/features/services/ServiceSearch";
import CommonPagination from "@/components/common/CommonPagination";
import { useUser } from "@/context/UserContext";
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
  const { checkIsSaving, filteredServices, paginatedServices } = useServicesData(state);

  const {
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    handlePageSizeChange,
  } = state;

  return (
    <div className="min-h-[400px] space-y-8">
      <ServiceList
        services={paginatedServices}
        isSearchActive={!!searchQuery.trim()}
        checkIsSaving={checkIsSaving}
        onEdit={onEdit}
        onDelete={onDelete}
        emptyTitle="No services found"
        emptyDescription="Get started by creating your first service."
      />
      <CommonPagination
        totalItems={filteredServices.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        itemName="services"
      />
    </div>
  );
};

const ServicesPage = () => {
  const { user } = useUser();
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
