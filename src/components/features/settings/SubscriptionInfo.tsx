import { useSuspenseMyBusiness } from "@/hooks/useBusiness";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SubscriptionInfo = () => {
  const { data: business } = useSuspenseMyBusiness();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-accent/50 text-accent-foreground border-accent hover:bg-accent/80 shadow-none">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="destructive" className="shadow-none">
            <XCircle className="w-3 h-3 mr-1" /> Expired
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="shadow-none">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm aa");
    } catch {
      return "Invalid Date";
    }
  };

  const creditPercentage = Math.min((business.freeSmsCredits / 100) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Subscription Info</CardTitle>
          <CardDescription>
            View your current plan and SMS credits.
          </CardDescription>
        </div>
        <div>{getStatusBadge(business.subscriptionStatus)}</div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Renewal Date
            </p>
            <div className="font-semibold tracking-tight text-lg">
              {formatDate(business.subscriptionEndDate)}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Next Reset
            </p>
            <div className="font-semibold tracking-tight text-lg">
              {formatDate(business.nextCreditResetDate)}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-muted-foreground/10 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-sm font-medium">Free Monthly SMS</span>
              <p className="text-xs text-muted-foreground">
                Resets every billing cycle
              </p>
            </div>
            <div>
              <span className="font-semibold text-2xl tracking-tighter tabular-nums">
                {business.freeSmsCredits}
              </span>
              <span className="text-muted-foreground text-sm"> / 100</span>
            </div>
          </div>
          <Progress value={creditPercentage} className="h-2" />
        </div>

        <div className="pt-6 border-t border-muted-foreground/10 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">SMS Top-up Balance</p>
            <p className="text-xs text-muted-foreground">
              Purchased credits that never expire
            </p>
          </div>
          <div className="font-semibold text-2xl text-primary tracking-tighter tabular-nums">
            {business.paidSmsCredits}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;
