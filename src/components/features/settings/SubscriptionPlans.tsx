import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePaymentMutations } from "@/hooks/usePayments";
import { Q_KEYS } from "@/constants/queryKeys";
import type { PayloroResponse } from "@/types/payment";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Orasa Pro Plan</CardTitle>
          <CardDescription>
            Unlock full automation and multi-branch management.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 grow">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">
              ₱{selectedMonths * 299}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              / {selectedMonths} mo{selectedMonths > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Select Duration
            </p>
            <div className="grid grid-cols-4 gap-2">
              {monthOptions.map((months) => (
                <Button
                  key={months}
                  variant={selectedMonths === months ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedMonths(months)}
                >
                  {months} Mo
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Features Included
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                "Unlimited staff accounts",
                "Multiple branch support",
                "Advanced analytics dashboard",
                "Automated SMS reminders",
                "100 Free SMS per month",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 bg-muted/20 mt-auto">
          <Button
            className="w-full"
            onClick={handleBuySubscription}
            disabled={isLoading}
          >
            Generate Payment QR
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>SMS Top-up</CardTitle>
          <CardDescription>
            Need more credits? Buy them here. Valid for all branches and never
            expires.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 grow">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Enter Credit Amount
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={100}
                max={1000}
                step={10}
                value={customCredits}
                onChange={handleCustomCreditsChange}
                className="w-full"
              />
              <span className="text-sm font-medium text-muted-foreground w-12 text-center">
                SMS
              </span>
            </div>
            {!isCreditsValid && (
              <p className="text-xs font-medium text-destructive">
                Minimum top-up is 100 and maximum is 1000
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-muted-foreground/10 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Price</p>
              <p className="text-xs text-muted-foreground">(₱1.00 / SMS)</p>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              ₱{customCredits || 0}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 bg-muted/20 mt-auto">
          <Button
            className="w-full"
            onClick={() => handleBuyCredits(customCredits as number)}
            disabled={isLoading || !isCreditsValid}
            variant="secondary"
          >
            Refill Credits
          </Button>
        </CardFooter>
      </Card>

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
