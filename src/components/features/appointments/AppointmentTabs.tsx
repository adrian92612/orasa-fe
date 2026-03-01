import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";
import { useMyBusiness } from "@/hooks/useBusiness";

type AppointmentTabsProps = {
  activeTab: string;
  onTabChange: (val: string) => void;
  isLoadingCounts: boolean;
  todayCount: number;
  upcomingCount: number;
  onCreate: () => void;
  todayContent: ReactNode;
  upcomingContent: ReactNode;
  allContent: ReactNode;
};

export const AppointmentTabs = ({
  activeTab,
  onTabChange,
  isLoadingCounts,
  todayCount,
  upcomingCount,
  onCreate,
  todayContent,
  upcomingContent,
  allContent,
}: AppointmentTabsProps) => {
  const { data: business } = useMyBusiness();
  const canManageAppointments = business?.subscriptionStatus === "ACTIVE";

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="today" disabled={isLoadingCounts}>
            Today ({isLoadingCounts ? "..." : todayCount})
          </TabsTrigger>
          <TabsTrigger value="upcoming" disabled={isLoadingCounts}>
            Next 7 Days ({isLoadingCounts ? "..." : upcomingCount})
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <Button
          onClick={onCreate}
          disabled={!canManageAppointments}
          title={
            !canManageAppointments
              ? "Subscription required to create appointments"
              : ""
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <TabsContent value="today">{todayContent}</TabsContent>
      <TabsContent value="upcoming">{upcomingContent}</TabsContent>
      <TabsContent value="all">{allContent}</TabsContent>
    </Tabs>
  );
};
