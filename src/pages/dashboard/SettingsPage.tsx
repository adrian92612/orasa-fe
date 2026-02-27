import { useUser } from "@/context/UserContext";

import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import BillingTab from "@/components/features/settings/BillingTab";
import ReminderConfigList from "@/components/features/sms/ReminderConfigList";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfile from "@/components/features/settings/BusinessProfile";
import SettingsPageSkeleton from "@/components/features/settings/SettingsPageSkeleton";

const SettingsPage = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsPageSkeleton />}>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing & Plans</TabsTrigger>
            <TabsTrigger value="reminders">SMS & Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <BusinessProfile />
          </TabsContent>

          <TabsContent value="billing" className="mt-6 outline-none">
            <BillingTab />
          </TabsContent>

          <TabsContent value="reminders" className="mt-6">
            <ReminderConfigList />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
};

export default SettingsPage;
