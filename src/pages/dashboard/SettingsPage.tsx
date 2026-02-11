import ChangePasswordForm from "@/components/features/settings/ChangePasswordForm";
import { useUser } from "@/context/UserContext";

const SettingsPage = () => {
  const { user } = useUser();

  if (user?.role === "STAFF") {
    return <ChangePasswordForm />;
  }

  return (
    <div className="space-y-6">
      {/* Placeholder for future business settings */}
      <div className="rounded-lg border bg-card shadow-sm p-8 text-center text-muted-foreground italic">
        Additional settings will be added here soon.
      </div>
    </div>
  );
};

export default SettingsPage;
