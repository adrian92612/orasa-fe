import { useState } from "react";
import { usePaymentMutations } from "@/hooks/usePayments";
import type { PayloroResponse } from "@/types/payment";
import { Zap, Check, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentDialog from "./PaymentDialog";

const SubscriptionPlans = () => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentData, setPaymentData] = useState<PayloroResponse | null>(null);

  const { createSubscriptionPayment, createCreditsPayment } =
    usePaymentMutations();

  const handleBuySubscription = async () => {
    setIsPaymentDialogOpen(true);
    try {
      const response = await createSubscriptionPayment.mutateAsync({
        months: selectedMonths,
      });
      if (response.data) {
        setPaymentData(response.data);
      }
    } catch {
      setIsPaymentDialogOpen(false);
    }
  };

  const handleBuyCredits = async (amount: number) => {
    setIsPaymentDialogOpen(true);
    try {
      const response = await createCreditsPayment.mutateAsync({
        credits: amount,
        method: "gcash-qr",
      });
      if (response.data) {
        setPaymentData(response.data);
      }
    } catch {
      setIsPaymentDialogOpen(false);
    }
  };

  const monthOptions = [1, 3, 6, 12];

  const isLoading =
    createSubscriptionPayment.isPending || createCreditsPayment.isPending;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold tracking-tight">1. Choose Pack</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <Card className="flex flex-col border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <Zap className="w-12 h-12 text-primary/5 -mr-4 -mt-4 rotate-12" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge
                  variant="outline"
                  className="border-primary text-primary font-bold"
                >
                  Monthly Subscription
                </Badge>
                <div className="text-right">
                  <span className="text-3xl font-black">
                    ₱{selectedMonths * 299}
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    {selectedMonths} month{selectedMonths > 1 ? "s" : ""}{" "}
                    renewal
                  </p>
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl font-black">
                Pro Plan
              </CardTitle>
              <CardDescription>
                Full access to all Orasa features. PHP 299/mo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Select Duration
                </p>
                <div className="flex flex-wrap gap-2">
                  {monthOptions.map((months) => (
                    <Button
                      key={months}
                      size="sm"
                      variant={
                        selectedMonths === months ? "default" : "outline"
                      }
                      className="h-8 min-w-[60px] font-bold"
                      onClick={() => setSelectedMonths(months)}
                    >
                      {months} Mo
                    </Button>
                  ))}
                </div>
              </div>

              <ul className="space-y-3 border-t pt-4">
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="rounded-full bg-green-500/10 p-0.5 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Structured appointment tracking
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="rounded-full bg-green-500/10 p-0.5 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Automated SMS reminders (100 free/mo)
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="rounded-full bg-green-500/10 p-0.5 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Advanced Analytics & Activity Logs
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <div className="rounded-full bg-green-500/10 p-0.5 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">
                    Support for multiple branches & staff
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full h-12 transition-all font-bold text-lg group-hover:scale-[1.02]"
                onClick={handleBuySubscription}
                disabled={isLoading}
              >
                <Zap className="mr-2 h-5 w-5 fill-current" />
                Pay via GCash
              </Button>
            </CardFooter>
          </Card>

          {/* Credit Packs */}
          <Card className="flex flex-col border-muted shadow-none">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge
                  variant="secondary"
                  className="font-bold uppercase tracking-tight"
                >
                  SMS Top-up
                </Badge>
                <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
              </div>
              <CardTitle className="mt-4 text-2xl font-black">
                SMS Credits
              </CardTitle>
              <CardDescription>
                Buy additional SMS credits. These credits do not expire.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 rounded-xl border bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="space-y-0.5">
                    <p className="font-bold text-lg">100 Credits</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      ₱1.00 per SMS
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl">₱100</span>
                    <Button
                      size="sm"
                      className="font-bold px-6"
                      onClick={() => handleBuyCredits(100)}
                      disabled={isLoading}
                    >
                      Buy
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 rounded-xl border-2 border-primary/30 bg-primary/5 transition-all hover:bg-primary/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg">500 Credits</p>
                      <Badge className="bg-green-600 hover:bg-green-700 text-[9px] h-4 px-1 leading-none font-black uppercase">
                        Save 10%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      ₱0.90 per SMS
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl">₱450</span>
                    <Button
                      size="sm"
                      className="font-bold px-6"
                      onClick={() => handleBuyCredits(500)}
                      disabled={isLoading}
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-medium leading-relaxed">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 opacity-60" />
                <p>
                  SMS credits are non-refundable. They are consumed upon each
                  outgoing message attempt to customers.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-[10px] text-muted-foreground text-center w-full font-medium">
                * Credits are added to your permanent balance immediately after
                payment.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setPaymentData(null);
        }}
        isLoading={isLoading}
        paymentData={paymentData}
        method="gcash-qr"
      />
    </div>
  );
};

export default SubscriptionPlans;
