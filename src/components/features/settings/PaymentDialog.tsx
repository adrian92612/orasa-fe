import type { PayloroResponse } from "@/types/payment";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { QRCodeCanvas } from "qrcode.react";
import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCallback, useEffect, useRef } from "react";

type PaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  paymentData: PayloroResponse | null;
  onPaymentSuccess?: () => void;
};

const PaymentDialog = ({ isOpen, onClose, isLoading, paymentData, onPaymentSuccess }: PaymentDialogProps) => {
  const { paymentStatus, reset } = usePaymentStatus(isOpen, paymentData?.platOrderNo);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const isSuccess = paymentStatus?.status === "SUCCESS";
  const isFailed = paymentStatus?.status === "FAILED" || paymentStatus?.status === "EXPIRED";

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `orasa-payment-qr-${paymentData?.platOrderNo || "code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onPaymentSuccess?.();
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onPaymentSuccess, handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Pay with QR Code</DialogTitle>
          <DialogDescription>
            Scan the QR code below to complete your payment using any QRPH compatible app (GCash, Maya, etc.).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground font-medium">Generating QR code...</p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4 mb-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
              <p className="text-lg font-black text-emerald-600 mb-1">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">
                Your{" "}
                {paymentStatus.type === "SUBSCRIPTION_RENEWAL"
                  ? "subscription has been renewed"
                  : "SMS credits have been added"}
                . Closing in a moment...
              </p>
            </div>
          ) : isFailed ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <p className="text-lg font-black text-destructive mb-1">Payment Failed</p>
              <p className="text-sm text-muted-foreground">The payment could not be completed. Please try again.</p>
            </div>
          ) : paymentData?.success ? (
            <>
              <div className="flex flex-col items-center gap-4 w-full">
                {paymentData.paymentImage && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-primary/10 max-w-[280px] w-full aspect-square flex items-center justify-center">
                    <QRCodeCanvas
                      ref={qrRef}
                      value={paymentData.paymentImage}
                      size={240}
                      level="H"
                      includeMargin={false}
                      className="w-full h-full"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQR}
                  className="w-full max-w-[280px] font-bold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border w-full text-center space-y-2">
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Reference No.</p>
                <p className="font-mono bg-background px-2 py-1 rounded border text-sm font-bold text-foreground">
                  {paymentData.platOrderNo}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <p className="text-[10px] text-muted-foreground font-bold">Waiting for payment...</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">Failed to initiate payment</p>
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
