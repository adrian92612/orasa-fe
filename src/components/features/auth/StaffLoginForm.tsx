import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

const StaffLoginForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Member</CardTitle>
        <CardDescription>
          Access your appointments and schedule.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter your username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <LogIn className="mr-2 h-4 w-4" /> Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StaffLoginForm;
