import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Calendar, CreditCard, MoreVertical } from "lucide-react";
import type { BusinessResponse } from "@/types/business";

type BusinessCardProps = {
  business: BusinessResponse;
  onActivate: (business: BusinessResponse) => void;
  onAddCredits: (business: BusinessResponse) => void;
  onExtend: (business: BusinessResponse) => void;
  onCancel: (business: BusinessResponse) => void;
};

const BusinessCard = ({
  business,
  onActivate,
  onAddCredits,
  onExtend,
  onCancel,
}: BusinessCardProps) => {
  return (
    <Card className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1 min-w-50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold leading-none tracking-tight">
            {business.name}
          </h3>
          <Badge
            variant={
              business.subscriptionStatus === "ACTIVE"
                ? "default"
                : business.subscriptionStatus === "PENDING"
                  ? "outline"
                  : "destructive"
            }
            className="ml-2"
          >
            {business.subscriptionStatus}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(business.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            Ends:{" "}
            {business.subscriptionEndDate
              ? new Date(business.subscriptionEndDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>
            SMS: {business.freeSmsCredits} Free / {business.paidSmsCredits} Paid
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {business.subscriptionStatus !== "ACTIVE" && (
              <DropdownMenuItem onClick={() => onActivate(business)}>
                Activate Subscription
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onAddCredits(business)}>
              Add Paid Credits
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onExtend(business)}>
              Extend Subscription
            </DropdownMenuItem>

            {business.subscriptionStatus !== "CANCELLED" && (
              <DropdownMenuItem
                onClick={() => onCancel(business)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                Cancel Subscription
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default BusinessCard;
