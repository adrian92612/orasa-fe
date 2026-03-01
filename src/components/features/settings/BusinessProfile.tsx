import { useSuspenseMyBusiness } from "@/hooks/useBusiness";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BusinessProfile = () => {
  const { user } = useUser();
  const { data: business } = useSuspenseMyBusiness();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            View and manage your general business information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Business Name
              </p>
              <div className="font-semibold tracking-tight text-lg">
                {business.name}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Owner Account
              </p>
              <div className="font-semibold tracking-tight text-lg">
                {user?.username}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-muted-foreground/10">
            <p className="text-xs text-muted-foreground font-medium">
              Looking to manage your subscription or SMS credits? Visit the
              <span className="text-foreground font-bold mx-1">
                Billing & Plans
              </span>
              tab.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
