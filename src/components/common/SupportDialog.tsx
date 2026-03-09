import { Copy, Mail, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type SupportDialogProps = {
  trigger: ReactNode;
};

const SUPPORT_EMAIL = "support@orasa.app";

export const SupportDialog = ({ trigger }: SupportDialogProps) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    toast.success("Support email copied to clipboard!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="dark sm:max-w-[425px] bg-slate-950 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="size-6 text-primary" />
            Contact Support
          </DialogTitle>
          <DialogDescription className="text-slate-400">Need help? Our team is ready to assist you.</DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-slate-400">Official Support Email</p>
            <code className="text-lg tracking-tight">{SUPPORT_EMAIL}</code>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyEmail}
              className="mt-1 bg-slate-800 hover:bg-slate-700 text-xs gap-2"
            >
              <Copy className="size-3" />
              Copy Email Address
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold">How would you like to reach out?</h4>
            <div className="grid gap-3">
              <Button asChild className="w-full h-12 justify-between px-4 group">
                <a href={`mailto:${SUPPORT_EMAIL}`} target="_blank">
                  <span className="flex items-center gap-3">
                    <ExternalLink className="size-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    Open Default Mail App
                  </span>
                  <span className="text-[10px] opacity-50 font-normal hidden sm:inline">Recommmended</span>
                </a>
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              * Average response time is within 24-48 hours. Please include your business name for faster assistance.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center border-t border-slate-800/50 pt-4">
          <DialogFooter showCloseButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
