import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import ServiceList from "@/components/features/services/ServiceList";
import ServiceSearch from "@/components/features/services/ServiceSearch";
import ServicePagination from "@/components/features/services/ServicePagination";

const ServiceDialog = lazy(
  () => import("@/components/features/services/ServiceDialog"),
);
const ServiceDeleteDialog = lazy(
  () => import("@/components/features/services/ServiceDeleteDialog"),
);
import type { ServiceResponse } from "@/types/service";

const ServicesPage = () => {
  const { data: services, isLoading } = useServices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const query = searchQuery.toLowerCase().trim();
  const filteredServices = services
    ? !query
      ? services
      : services.filter((s) => {
          const nameMatch = s.name.toLowerCase().includes(query);
          const descMatch = s.description?.toLowerCase().includes(query);
          const priceMatch = s.basePrice.toString().includes(query);
          return nameMatch || descMatch || priceMatch;
        })
    : [];

  const start = (currentPage - 1) * pageSize;
  const paginatedServices = filteredServices.slice(start, start + pageSize);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setCurrentPage(1);
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

      <ServiceSearch value={searchQuery} onChange={handleSearchChange} />

      <div className="min-h-[400px]">
        <ServiceList
          services={paginatedServices}
          isLoading={isLoading}
          isSearchActive={!!searchQuery.trim()}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ServicePagination
        totalItems={filteredServices.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

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
