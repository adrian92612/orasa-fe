import { useState } from "react";

import type { BusinessResponse } from "@/types/business";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAdminBusinesses,
  useActivateSubscription,
  useExtendSubscription,
  useCancelSubscription,
  useAddCredits,
  useSeedDemoData,
} from "@/hooks/useAdmin";
import CommonPagination from "@/components/common/CommonPagination";
import { Button } from "@/components/ui/button";
import { Building2, Database } from "lucide-react";
import BusinessCard from "@/components/features/admin/BusinessCard";
import BusinessFilters from "@/components/features/admin/BusinessFilters";
import AdminAddCreditsDialog from "@/components/features/admin/AdminAddCreditsDialog";
import AdminConfirmationDialog from "@/components/features/admin/AdminConfirmationDialog";
import AdminExtendDialog from "@/components/features/admin/AdminExtendDialog";

const AdminDashboardPage = () => {
  const [extendMonths, setExtendMonths] = useState(1);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessResponse | null>(null);
  const [confirmationState, setConfirmationState] = useState<{
    type: "ACTIVATE" | "CANCEL";
    business: BusinessResponse;
  } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { data: businessesPage, isLoading } = useAdminBusinesses({
    query: debouncedSearch,
    status: statusFilter,
    page,
    size: pageSize,
  });

  const activateMutation = useActivateSubscription();
  const extendMutation = useExtendSubscription();
  const cancelMutation = useCancelSubscription();
  const addCreditsMutation = useAddCredits();
  const seedMutation = useSeedDemoData();

  const [creditsToAdd, setCreditsToAdd] = useState(50);
  const [showAddCreditsDialog, setShowAddCreditsDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);

  const handleAddCredits = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBusiness) {
      addCreditsMutation.mutate(
        {
          businessId: selectedBusiness.id,
          credits: creditsToAdd,
        },
        {
          onSuccess: () => {
            setSelectedBusiness(null);
          },
        },
      );
    }
    setShowAddCreditsDialog(false);
  };

  const handleActivate = (business: BusinessResponse) => {
    setConfirmationState({ type: "ACTIVATE", business });
  };

  const handleCancel = (business: BusinessResponse) => {
    setConfirmationState({ type: "CANCEL", business });
  };

  const handleExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBusiness) {
      extendMutation.mutate(
        {
          businessId: selectedBusiness.id,
          months: extendMonths,
        },
        {
          onSuccess: () => {
            setSelectedBusiness(null);
          },
        },
      );
    }
    setShowExtendDialog(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(0);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(0);
  };

  const handleConfirmAction = () => {
    if (confirmationState) {
      const { type, business } = confirmationState;
      if (type === "ACTIVATE") {
        activateMutation.mutate(business.id);
      } else {
        cancelMutation.mutate(business.id);
      }
      setConfirmationState(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Business Management
          </h2>
          <p className="text-muted-foreground">
            Manage all registered businesses and subscriptions.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => seedMutation.mutate()}
          disabled={seedMutation.isPending}
        >
          <Database className="mr-2 h-4 w-4" />
          {seedMutation.isPending ? "Seeding..." : "Seed Demo Data"}
        </Button>
      </div>

      <BusinessFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 w-full rounded-lg border bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : businessesPage?.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border bg-white border-dashed">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No businesses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {businessesPage?.content.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onActivate={handleActivate}
              onAddCredits={(b) => {
                setSelectedBusiness(b);
                setCreditsToAdd(50);
                setShowAddCreditsDialog(true);
              }}
              onExtend={(b) => {
                setSelectedBusiness(b);
                setExtendMonths(1);
                setShowExtendDialog(true);
              }}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {businessesPage && (
        <CommonPagination
          totalItems={businessesPage.totalElements}
          pageSize={pageSize}
          currentPage={page + 1}
          onPageChange={(p) => setPage(p - 1)}
          onPageSizeChange={(s) => {
            setPageSize(parseInt(s));
            setPage(0);
          }}
          itemName="businesses"
        />
      )}

      {/* Dialogs */}
      <AdminAddCreditsDialog
        isOpen={showAddCreditsDialog}
        onOpenChange={setShowAddCreditsDialog}
        creditsToAdd={creditsToAdd}
        onCreditsChange={setCreditsToAdd}
        onSubmit={handleAddCredits}
        isPending={addCreditsMutation.isPending}
      />

      <AdminExtendDialog
        isOpen={showExtendDialog}
        onOpenChange={setShowExtendDialog}
        extendMonths={extendMonths}
        onExtendMonthsChange={setExtendMonths}
        onSubmit={handleExtend}
        isPending={extendMutation.isPending}
      />

      <AdminConfirmationDialog
        confirmationState={confirmationState}
        onOpenChange={(open) => !open && setConfirmationState(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default AdminDashboardPage;
