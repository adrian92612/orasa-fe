import { useUser } from "@/context/UserContext";

import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import ReminderConfigList from "@/components/features/sms/ReminderConfigList";

const SettingsPage = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      <ReminderConfigList />
    </div>
  );
};

export default SettingsPage;
