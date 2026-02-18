import { useUser } from "@/context/UserContext";

import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import BillingTab from "@/components/features/settings/BillingTab";
import ReminderConfigList from "@/components/features/sms/ReminderConfigList";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfile from "@/components/features/settings/BusinessProfile";
import BusinessProfileSkeleton from "@/components/features/settings/BusinessProfileSkeleton";
import { ReminderConfigListSkeleton } from "@/components/features/sms/ReminderConfigListSkeleton";

const SettingsPage = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing & Plans</TabsTrigger>
          <TabsTrigger value="reminders">SMS & Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Suspense fallback={<BusinessProfileSkeleton />}>
            <BusinessProfile />
          </Suspense>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 outline-none">
          <BillingTab />
        </TabsContent>

        <TabsContent value="reminders" className="mt-6">
          <Suspense fallback={<ReminderConfigListSkeleton />}>
            <ReminderConfigList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
