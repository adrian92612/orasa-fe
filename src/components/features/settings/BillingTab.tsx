import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionPlans from "./SubscriptionPlans";

const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Billing & Plans
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your business plan, credits, and payment history.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Suspense
          fallback={
            <Card className="h-[300px] w-full animate-pulse bg-muted/20 border-border" />
          }
        >
          <SubscriptionInfo />
        </Suspense>

        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default BillingTab;
