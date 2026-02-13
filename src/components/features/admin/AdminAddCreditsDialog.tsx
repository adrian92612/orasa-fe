import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminAddCreditsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creditsToAdd: number;
  onCreditsChange: (credits: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
};

const AdminAddCreditsDialog = ({
  isOpen,
  onOpenChange,
  creditsToAdd,
  onCreditsChange,
  onSubmit,
  isPending,
}: AdminAddCreditsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Paid Credits</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Credits to Add</Label>
            <Input
              type="number"
              min="1"
              value={creditsToAdd}
              onChange={(e) => onCreditsChange(parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              These credits will be added to the business's paid credit balance.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Confirm Add Credits"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddCreditsDialog;
