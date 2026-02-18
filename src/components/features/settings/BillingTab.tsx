import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SubscriptionInfo from "./SubscriptionInfo";
import SubscriptionPlans from "./SubscriptionPlans";

const BillingTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 outline-none">
      <div className="lg:col-span-4 h-fit">
        <Suspense
          fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}
        >
          <SubscriptionInfo />
        </Suspense>
      </div>

      <div className="lg:col-span-8">
        <SubscriptionPlans />
      </div>
    </div>
  );
};

export default BillingTab;
