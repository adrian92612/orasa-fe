import type { PayloroResponse } from "@/types/payment";
import { CheckCircle2, Copy, Loader2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  paymentData: PayloroResponse | null;
  method: string;
};

const PaymentDialog = ({
  isOpen,
  onClose,
  isLoading,
  paymentData,
  method,
}: PaymentDialogProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    if (!paymentData?.paymentLink) return;
    navigator.clipboard.writeText(paymentData.paymentLink);
    setIsCopied(true);
    toast.success("Payment link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getMethodName = (m: string) => {
    switch (m) {
      case "gcash":
      case "gcash-qr":
        return "GCash";
      case "grabpay":
        return "GrabPay";
      case "maya":
        return "Maya";
      case "qrph":
        return "QRPH";
      default:
        return m.toUpperCase();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pay with {getMethodName(method)}</DialogTitle>
          <DialogDescription>
            Scan the QR code or click the link below to complete your payment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground font-medium">
                Generating QR code...
              </p>
            </div>
          ) : paymentData?.success ? (
            <>
              {paymentData.paymentImage && (
                <div className="bg-white p-4 rounded-xl shadow-inner border max-w-[240px] w-full aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    src={paymentData.paymentImage}
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="w-full space-y-3">
                <Button
                  className="w-full"
                  onClick={() =>
                    window.open(paymentData.paymentLink || "", "_blank")
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Payment Link
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyLink}
                >
                  {isCopied ? (
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {isCopied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border w-full text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  After payment, it may take 1-2 minutes for your account to
                  reflect the changes. Please keep your reference number:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {paymentData.platOrderNo}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to initiate payment
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentData?.errorMessage || "An unexpected error occurred."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
