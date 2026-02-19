import { useSuspenseMyBusiness } from "@/hooks/useBusiness";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, Zap, ShieldCheck } from "lucide-react";
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
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider shadow-none">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Active
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider shadow-none"
          >
            <XCircle className="w-3 h-3 mr-1.5" /> Expired
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 px-3 py-1 font-bold text-[10px] uppercase tracking-wider shadow-none"
          >
            <Clock className="w-3 h-3 mr-1.5" /> Pending
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
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden border">
      <CardHeader className="pb-6 border-b border-muted/50 bg-muted/20">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Subscription Info
            </CardTitle>
            <CardDescription className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
              Manage your Orasa Pro plan
            </CardDescription>
          </div>
          {getStatusBadge(business.subscriptionStatus)}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 space-y-8">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Renewal Date
              </p>
              <p className="font-bold text-sm tracking-tight text-foreground">
                {formatDate(business.subscriptionEndDate)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-muted/50 space-y-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                Next Reset
              </p>
              <p className="font-bold text-sm tracking-tight text-foreground">
                {formatDate(business.nextCreditResetDate)}
              </p>
            </div>
          </div>

          {/* Credits Section */}
          <div className="space-y-6 pt-2">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Free Monthly SMS
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black tabular-nums text-foreground tracking-tighter">
                      {business.freeSmsCredits}
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">
                      / 100 remaining
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-black tabular-nums h-5 px-1.5 bg-background shadow-none"
                >
                  {Math.round(creditPercentage)}%
                </Badge>
              </div>
              <Progress
                value={creditPercentage}
                className="h-2.5 bg-muted/50 border border-muted-foreground/5 shadow-inner"
              />
            </div>

            <div className="relative group overflow-hidden p-5 rounded-2xl bg-primary/5 border border-primary/20 transition-all hover:bg-primary/10">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
                <Zap className="w-16 h-16 text-primary" />
              </div>
              <div className="relative flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                    SMS Top-up Balance
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tabular-nums text-primary tracking-tighter">
                      {business.paidSmsCredits}
                    </span>
                    <span className="text-[9px] font-black text-primary/70 uppercase px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      Forever
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-primary/10">
                  <Zap className="w-5 h-5 text-primary fill-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/20 border-t border-muted/50">
          <div className="flex items-center gap-3 text-amber-600/80">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-[10px] font-bold leading-tight italic">
              Unused free credits do not roll over. Next refresh on{" "}
              {formatDate(business.nextCreditResetDate)}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;
