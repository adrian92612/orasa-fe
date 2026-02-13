import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminExtendDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  extendMonths: number;
  onExtendMonthsChange: (months: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
};

const AdminExtendDialog = ({
  isOpen,
  onOpenChange,
  extendMonths,
  onExtendMonthsChange,
  onSubmit,
  isPending,
}: AdminExtendDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Months to Add</Label>
            <Input
              type="number"
              min="1"
              value={extendMonths}
              onChange={(e) => onExtendMonthsChange(parseInt(e.target.value))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Extending..." : "Confirm Extension"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminExtendDialog;
