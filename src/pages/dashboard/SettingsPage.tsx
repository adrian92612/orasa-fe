import { useUser } from "@/context/UserContext";

import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import BillingTab from "@/components/features/settings/BillingTab";
import ReminderConfigList from "@/components/features/sms/ReminderConfigList";

import { Suspense } from "react";
import { useSearchParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfile from "@/components/features/settings/BusinessProfile";
import SettingsPageSkeleton from "@/components/features/settings/SettingsPageSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  {
    value: "profile",
    label: "Profile",
    component: () => <BusinessProfile />,
  },
  {
    value: "billing",
    label: "Billing & Plans",
    component: () => <BillingTab />,
  },
  {
    value: "reminders",
    label: "SMS & Reminders",
    component: () => <ReminderConfigList />,
  },
];

const SettingsPage = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsPageSkeleton />}>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          orientation={isMobile ? "vertical" : "horizontal"}
          className={cn(isMobile ? "flex-col" : "flex-row", "w-full")}
        >
          <TabsList className="w-full justify-start">
            {SETTINGS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SETTINGS_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </Suspense>
    </div>
  );
};

export default SettingsPage;
