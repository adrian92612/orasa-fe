import { useState } from "react";
import { Download } from "lucide-react";

import { useUser } from "@/context/UserContext";
import { useExport } from "@/hooks/useExport";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export const ExportDialog = () => {
  const { user } = useUser();
  const { triggerExport, isExporting } = useExport(user?.businessId || null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const handleExport = () => {
    triggerExport(month, year);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Export Appointments</DialogTitle>
          <DialogDescription>Select a month and year to export appointment data as CSV.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="export-month">Month</Label>
            <Select value={String(month)} onValueChange={(val) => setMonth(Number(val))}>
              <SelectTrigger id="export-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="export-year">Year</Label>
            <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger id="export-year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
