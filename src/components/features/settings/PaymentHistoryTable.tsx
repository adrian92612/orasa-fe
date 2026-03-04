import { usePaymentHistory } from "@/hooks/usePayments";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 shadow-none hover:bg-green-100/80">
          Success
        </Badge>
      );
    case "FAILED":
    case "EXPIRED":
      return (
        <Badge variant="destructive" className="shadow-none">
          {status === "FAILED" ? "Failed" : "Expired"}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" className="shadow-none">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const PaymentHistoryTable = () => {
  const { data: payments = [], isLoading } = usePaymentHistory();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View your past subscription renewals and SMS credit top-ups.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <p>No payment history found.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(payment.createdAt), "MMM d, yyyy h:mm aa")}
                    </TableCell>
                    <TableCell className="font-medium">{payment.merchantOrderNo}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryTable;
