import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

type TermsOnboardingFormProps = {
  onAccept: (acceptedAt: string) => void;
};

const TermsOnboardingForm = ({ onAccept }: TermsOnboardingFormProps) => {
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      onAccept(new Date().toISOString());
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Terms and Conditions</CardTitle>
        <CardDescription>
          Please read and accept our terms to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="bg-slate-100 p-4 rounded-md h-64 overflow-y-auto w-full text-sm text-slate-700 leading-relaxed border space-y-4">
          <p>
            <strong>1. Acceptance of Services</strong>
            <br />
            By using Orasa, you agree to these Terms and our Privacy Policy.
            This is a legal agreement between your business and Orasa.
          </p>
          <p>
            <strong>2. Service Scope & SMS Communications</strong>
            <br />
            SMS reminders are provided on a best-effort basis. We do not
            guarantee absolute delivery due to external carrier factors. You
            confirm you have obtained express consent from customers to send
            these messages.
          </p>
          <p>
            <strong>3. Subscription, Credits, and Billing</strong>
            <br />
            SMS credits are refreshed monthly and{" "}
            <strong>do not roll over</strong>. Exhausting credits will pause
            delivery until the next cycle or a top-up. Fees are non-refundable.
          </p>
          <p>
            <strong>4. Data Privacy and Ownership</strong>
            <br />
            You own your customer data. Orasa processes it only to provide the
            service. You are responsible for account security and OAuth
            credentials.
          </p>
          <p>
            <strong>5. Limitation of Liability</strong>
            <br />
            Orasa is provided "as-is." We are not liable for indirect damages or
            business losses resulting from service interruptions or delivery
            failures.
          </p>
          <p>
            <strong>6. Termination</strong>
            <br />
            We reserve the right to suspend accounts that violate these terms or
            engage in abusive messaging practices.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full justify-center">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(c) => setAgreed(c as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the terms and conditions
          </label>
        </div>

        <Button
          className="w-full max-w-sm"
          disabled={!agreed}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default TermsOnboardingForm;
