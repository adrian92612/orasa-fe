import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AppointmentsPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
        Calendar / List view will go here
      </div>
    </div>
  );
};

export default AppointmentsPage;
