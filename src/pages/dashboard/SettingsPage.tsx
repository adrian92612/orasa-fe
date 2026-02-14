import { useUser } from "@/context/UserContext";

import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import ReminderConfigList from "@/components/features/sms/ReminderConfigList";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessProfile from "@/components/features/settings/BusinessProfile";
import { BusinessProfileSkeleton } from "@/components/features/settings/BusinessProfileSkeleton";
import { ReminderConfigListSkeleton } from "@/components/features/sms/ReminderConfigListSkeleton";

const SettingsPage = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="general">General & Subscription</TabsTrigger>
          <TabsTrigger value="reminders">SMS & Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Suspense fallback={<BusinessProfileSkeleton />}>
            <BusinessProfile />
          </Suspense>
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
