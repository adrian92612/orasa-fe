import { APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";

const DashboardPage = () => {
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{user.username}</span>!
          </p>
          <div className="mt-4 text-gray-600">
            <p>Role: {user.role}</p>
            <p>User ID: {user.userId}</p>
            {user.businessId && <p>Business ID: {user.businessId}</p>}
          </div>
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default DashboardPage;
