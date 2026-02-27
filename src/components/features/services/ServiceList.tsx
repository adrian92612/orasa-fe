import { Search } from "lucide-react";
import ServiceCard from "./ServiceCard";
import type { ServiceResponse } from "@/types/service";

type ServiceListProps = {
  services: ServiceResponse[];
  isSearchActive: boolean;
  checkIsSaving?: (serviceId: string) => boolean;
  onEdit: (service: ServiceResponse) => void;
  onDelete?: (service: ServiceResponse) => void;
  onToggleActive?: (service: ServiceResponse) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

const ServiceList = ({
  services,
  isSearchActive,
  checkIsSaving,
  onEdit,
  onDelete,
  onToggleActive,
  emptyTitle = "No services found",
  emptyDescription = "You haven't created any services yet. Services you add will appear here.",
}: ServiceListProps) => {
  if (services.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center bg-muted/20">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold italic">
          {isSearchActive ? "No services matching your search" : emptyTitle}
        </h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          {isSearchActive
            ? "Try adjusting your search query or filters to find what you're looking for."
            : emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          showSaving={service.isOptimistic || checkIsSaving?.(service.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default ServiceList;
