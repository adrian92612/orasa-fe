import { APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";

const AnalyticsPage = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate(APP_ROUTES.LOGIN);
  }

  if (user && !user.businessId) {
    navigate(APP_ROUTES.ONBOARDING);
  }

  const isOwner = user?.role === "OWNER";

  return (
    <div>
      {isOwner ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Placeholder Analytics Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </h3>
            <div className="text-2xl font-bold">₱0.00</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-muted-foreground">
              Appointments
            </h3>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
      ) : (
        <p>Error loading user info.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
