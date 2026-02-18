import { useSuspenseMyBusiness } from "@/hooks/useBusiness";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Info, Zap } from "lucide-react";
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
          <Badge className="bg-green-500 hover:bg-green-600 font-bold">
            <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge variant="destructive" className="font-bold">
            <XCircle className="w-3 h-3 mr-1" /> EXPIRED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="font-bold">
            <Clock className="w-3 h-3 mr-1" /> PENDING
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const creditPercentage = Math.min((business.freeSmsCredits / 100) * 100, 100);

  return (
    <Card className="bg-muted/30 border-none shadow-none overflow-hidden relative">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Info className="w-12 h-12" />
      </div>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black tracking-tight">
          Current Subscription
        </CardTitle>
        <CardDescription className="font-medium text-xs">
          Overview of your active plan and remaining quotas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Plan Status
            </p>
            <div className="flex items-center gap-2 pt-1">
              {getStatusBadge(business.subscriptionStatus)}
            </div>
            {business.subscriptionStatus === "ACTIVE" && (
              <p className="text-[11px] text-muted-foreground font-medium">
                Renew by{" "}
                <span className="text-foreground font-bold">
                  {formatDate(business.subscriptionEndDate)}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Next Reset Date
            </p>
            <p className="font-bold text-sm pt-1">
              {formatDate(business.nextCreditResetDate)}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Free credits will be refreshed.
            </p>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-muted-foreground/10">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Free Monthly Credits
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black tabular-nums">
                    {business.freeSmsCredits}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground tracking-tighter">
                    / 100 REMAINING
                  </span>
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {Math.round(creditPercentage)}%
              </p>
            </div>
            <Progress value={creditPercentage} className="h-2.5 bg-muted" />
          </div>

          <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-muted-foreground/5 flex justify-between items-center group transition-colors hover:bg-white/80 dark:hover:bg-black/30">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                Paid Credits Balance
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black tabular-nums text-primary">
                  {business.paidSmsCredits}
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                  non-expiring
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary fill-primary/20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;
