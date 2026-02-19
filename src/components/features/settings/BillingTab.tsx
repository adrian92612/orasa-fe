import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionPlans from "./SubscriptionPlans";

const BillingTab = () => {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          Billing & Subscription
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          Manage your business plan, credits, and payment history.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <Suspense
          fallback={
            <Card className="h-[450px] w-full rounded-2xl animate-pulse bg-muted/20 border-none" />
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
