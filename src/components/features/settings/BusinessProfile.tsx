import { useMyBusiness } from "@/hooks/useBusiness";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BusinessProfile = () => {
  const { user } = useUser();

  const { data: business, isLoading, error } = useMyBusiness();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load business profile. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Expired
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy hh:mm a");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            Manage your business details and subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Business Name
              </label>
              <div className="font-semibold text-lg">{business.name}</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Owner Email
              </label>
              <div className="font-medium">{user?.username}</div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Subscription & Usage</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  {getStatusBadge(business.subscriptionStatus)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Subscription Ends
                </label>
                <div className="font-medium">
                  {formatDate(business.subscriptionEndDate)}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                SMS Credits
                <Badge variant="outline" className="text-xs font-normal">
                  Monthly Cycle
                </Badge>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Free Credits
                  </div>
                  <div className="text-2xl font-bold">
                    {business.freeSmsCredits}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Resets on {formatDate(business.nextCreditResetDate)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Paid Credits
                  </div>
                  <div className="text-2xl font-bold">
                    {business.paidSmsCredits}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Does not expire
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action for Expired/Low Credits of just general help */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {business.subscriptionStatus === "EXPIRED" && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Subscription Expired</AlertTitle>
                  <AlertDescription>
                    Your subscription has expired. Access to creating
                    appointments and analytics is restricted. Please contact
                    support to renew.
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground">
                Need to renew or top-up credits?{" "}
                <a
                  href="mailto:support@orasa.ph"
                  className="text-primary hover:underline font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfile;
