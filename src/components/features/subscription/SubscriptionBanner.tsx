import { useState, useEffect } from "react";
import { useMyBusiness } from "@/hooks/useBusiness";
import { differenceInDays, parseISO } from "date-fns";
import { AlertCircle, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SubscriptionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<"destructive" | "warning">("warning");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const { data: business } = useMyBusiness();

  useEffect(() => {
    if (!business) return;

    const isDismissed = sessionStorage.getItem("subscription-banner-dismissed");
    if (isDismissed) return;

    const checkStatus = () => {
      if (business.subscriptionStatus === "PENDING") {
        setVariant("destructive");
        setTitle("Subscription Pending");
        setMessage(
          "Your subscription is pending activation. Access is restricted. Please complete payment to activate your account.",
        );
        setIsVisible(true);
        return;
      }

      if (business.subscriptionStatus === "EXPIRED") {
        setVariant("destructive");
        setTitle("Subscription Expired");
        setMessage(
          "Your subscription has expired. Access to creating appointments and analytics is restricted. Please contact support to renew.",
        );
        setIsVisible(true);
        return;
      }

      if (
        business.subscriptionStatus === "ACTIVE" &&
        business.subscriptionEndDate
      ) {
        const endDate = parseISO(business.subscriptionEndDate);
        const daysUntilExpiry = differenceInDays(endDate, new Date());

        if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
          setVariant("warning");
          setTitle("Subscription Expiring Soon");
          setMessage(
            `Your subscription expires in ${daysUntilExpiry} days. Please renew soon to avoid interruption.`,
          );
          setIsVisible(true);
        }
      }
    };

    checkStatus();
  }, [business]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("subscription-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div
      className={`w-full p-4 border-b flex items-start justify-between gap-4 ${
        variant === "destructive"
          ? "bg-red-50 border-red-200 text-red-900"
          : "bg-yellow-50 border-yellow-200 text-yellow-900"
      }`}
    >
      <div className="flex items-start gap-3">
        {variant === "destructive" ? (
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-red-600" />
        ) : (
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-yellow-600" />
        )}
        <div className="text-sm">
          <p className="font-semibold mb-1">{title}</p>
          <p>{message}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 shrink-0 hover:bg-transparent ${
          variant === "destructive"
            ? "text-red-900 hover:text-red-700"
            : "text-yellow-900 hover:text-yellow-700"
        }`}
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  );
};

export default SubscriptionBanner;
