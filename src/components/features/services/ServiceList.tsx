import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Clock,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ServiceResponse } from "@/types/service";

interface ServiceListProps {
  services: ServiceResponse[];
  isLoading: boolean;
  isSearchActive: boolean;
  onEdit: (service: ServiceResponse) => void;
  onDelete: (service: ServiceResponse) => void;
}

const ServiceList = ({
  services,
  isLoading,
  isSearchActive,
  onEdit,
  onDelete,
}: ServiceListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-14 w-full animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center bg-muted/20">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold italic">
          {isSearchActive
            ? "No services matching your search"
            : "No services found"}
        </h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          {isSearchActive
            ? "Try adjusting your search query or filters to find what you're looking for."
            : "You haven't created any services yet. Services you add will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div
          key={service.id}
          className="group relative flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:bg-accent/40 hover:shadow-sm"
        >
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight truncate">
                  {service.name}
                </h3>
                {service.availableGlobally ? (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-50/80 border-blue-100 flex items-center gap-1 text-[10px] h-4.5 px-1.5 font-semibold"
                  >
                    <Globe className="h-2.5 w-2.5" />
                    Global
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-gray-500 border-gray-100 flex items-center gap-1 text-[10px] h-4.5 px-1.5 font-medium"
                  >
                    <Lock className="h-2.5 w-2.5" />
                    Restricted
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {service.durationMinutes} mins
                </div>
                {service.description && (
                  <p className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-md italic">
                    • {service.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-primary">
                ₱
                {service.basePrice.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => onEdit(service)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem
                    onClick={() => onDelete(service)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Service
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
