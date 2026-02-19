import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePaymentMutations } from "@/hooks/usePayments";
import { Q_KEYS } from "@/constants/queryKeys";
import type { PayloroResponse } from "@/types/payment";
import {
  Zap,
  Check,
  HelpCircle,
  ShieldCheck,
  ShoppingCart,
  Info,
  Smartphone,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import PaymentDialog from "./PaymentDialog";

const SubscriptionPlans = () => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [paymentData, setPaymentData] = useState<PayloroResponse | null>(null);
  const queryClient = useQueryClient();

  const { createSubscriptionPayment, createCreditsPayment } =
    usePaymentMutations();

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [Q_KEYS.BUSINESSES] });
    queryClient.invalidateQueries({ queryKey: [Q_KEYS.CURRENT_USER] });
  };

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
  const [customCredits, setCustomCredits] = useState<number | "">(100);

  const handleCustomCreditsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setCustomCredits("");
      return;
    }

    const value = parseInt(rawValue);
    if (!isNaN(value)) {
      setCustomCredits(value);
    }
  };

  const isCreditsValid =
    typeof customCredits === "number" &&
    customCredits >= 100 &&
    customCredits <= 1000;

  const isLoading =
    createSubscriptionPayment.isPending || createCreditsPayment.isPending;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h3 className="text-lg font-black tracking-tight text-foreground uppercase">
            Upgrade Your Experience
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pro Plan Card */}
          <Card className="lg:col-span-12 xl:col-span-7 flex flex-col border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group bg-background/50 backdrop-blur-sm border-2">
            <div className="absolute top-0 right-0 p-4">
              <div className="h-24 w-24 bg-primary/5 rounded-full -mr-12 -mt-12 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary/40 mr-6 mt-6" />
              </div>
            </div>

            <CardHeader className="pb-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <Badge className="bg-primary text-primary-foreground font-black px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider mb-2">
                    Most Popular
                  </Badge>
                  <CardTitle className="text-3xl font-black tracking-tighter">
                    Orasa Pro Plan
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">
                    Unlock full automation and multi-branch management.
                  </CardDescription>
                </div>
                <div className="text-right glass-panel p-4 rounded-2xl bg-muted/50 border border-muted/50">
                  <span className="text-4xl font-black tabular-nums tracking-tighter text-foreground">
                    ₱{selectedMonths * 299}
                  </span>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5 opacity-70">
                    Total for {selectedMonths} mo{selectedMonths > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 grow">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  1. Select Duration
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {monthOptions.map((months) => (
                    <Button
                      key={months}
                      variant={
                        selectedMonths === months ? "default" : "outline"
                      }
                      className={`h-12 font-black text-sm rounded-xl transition-all border-2 ${
                        selectedMonths === months
                          ? "border-primary shadow-lg shadow-primary/20 scale-105"
                          : "border-muted/50 hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedMonths(months)}
                    >
                      {months} Mo
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  2. Features Included
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    "Unlimited staff accounts",
                    "Multiple branch support",
                    "Advanced analytics dashboard",
                    "Automated SMS reminders",
                    "100 Free SMS per month",
                    "Activity & SMS logs access",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-[13px] font-bold text-foreground/80 tracking-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-8 border-t border-muted/50 bg-muted/20">
              <Button
                className="w-full h-14 rounded-2xl transition-all font-black text-lg group-hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-primary/30"
                onClick={handleBuySubscription}
                disabled={isLoading}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center bg-white/20 rounded-lg">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                Generate Payment QR
              </Button>
            </CardFooter>
          </Card>

          {/* SMS Top-up Card */}
          <Card className="lg:col-span-12 xl:col-span-5 flex flex-col border-muted/50 shadow-sm bg-background/30 backdrop-blur-sm border-2">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="font-black text-[10px] uppercase tracking-widest bg-background/50 mb-2 border-muted-foreground/20"
                  >
                    Additional Units
                  </Badge>
                  <CardTitle className="text-2xl font-black tracking-tight">
                    SMS Top-up
                  </CardTitle>
                </div>
                <HelpCircle className="w-5 h-5 text-muted-foreground opacity-40 hover:opacity-100 cursor-help transition-opacity" />
              </div>
              <CardDescription className="text-xs font-medium">
                Running low? Enter the amount of credits you wish to add.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 grow">
              <div className="p-6 rounded-2xl border bg-background/50 hover:bg-background hover:border-primary/30 transition-all group overflow-hidden relative">
                <div className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Enter Credit Amount
                    </p>
                    <div className="relative">
                      <Input
                        type="number"
                        min={100}
                        max={1000}
                        step={10}
                        value={customCredits}
                        onChange={handleCustomCreditsChange}
                        className="h-14 pl-12 text-2xl font-black tracking-tighter rounded-xl border-2 border-muted hover:border-primary/50 focus:border-primary transition-all pr-12"
                      />
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground uppercase tracking-widest">
                        SMS
                      </span>
                    </div>
                  </div>

                  {!isCreditsValid && (
                    <p className="text-[10px] font-black text-destructive uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">
                      Minimum top-up is 100 and maximum is 1000
                    </p>
                  )}

                  <div className="flex justify-between items-end pt-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        Total Price
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black tracking-tighter text-foreground">
                          ₱{customCredits}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          (₱1.00 / SMS)
                        </span>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="font-black px-6 h-12 rounded-xl shadow-lg transition-transform active:scale-95 group-hover:shadow-primary/20"
                      onClick={() => handleBuyCredits(customCredits as number)}
                      disabled={isLoading || !isCreditsValid}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Refill
                    </Button>
                  </div>
                </div>
                <Smartphone className="absolute -bottom-8 -right-8 w-32 h-32 text-muted/5 group-hover:text-primary/5 transition-colors -rotate-12 pointer-events-none" />
              </div>
            </CardContent>

            <CardFooter className="mt-auto">
              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex gap-3 mt-4">
                <div className="h-4 w-4 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-2.5 h-2.5 text-amber-600" />
                </div>
                <p className="text-[10px] text-amber-900/70 font-bold leading-relaxed italic">
                  Credits are non-refundable and never expire. Valid for all
                  branches under your business.
                </p>
              </div>
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
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default SubscriptionPlans;
