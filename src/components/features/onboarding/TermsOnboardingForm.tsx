import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const TERMS_AND_CONDITIONS = [
  {
    header: "Part 1: Terms and Conditions (T&C)",
    content: [
      "Effective Date: March 1, 2026",
      'By creating an account on Orasa via Google SSO, you (the "User" or "Business Owner") agree to the following terms:',
    ],
  },
  {
    header: "1. Subscription and Fees",
    content: [
      "Pricing: The standard subscription fee is ₱299.00 per month. This fee grants access to the Orasa dashboard, client management, and scheduling tools.",
      'Billing: Subscriptions are billed monthly. Failure to renew will result in the suspension of the "Create Appointment" feature.',
      "Unsubscribed Access: Users without an active subscription may access their dashboard and settings but are restricted from creating new appointments.",
    ],
  },
  {
    header: "2. SMS Credits and Fair Use",
    content: [
      "Monthly Allocation: Each active subscription includes 100 free SMS credits per billing cycle. Unused free credits do not roll over to the next month.",
      'Top-ups: Users may purchase additional SMS credits ("Top-ups") at the current market rate. Top-up credits do not expire as long as the account remains active.',
      "Telco Disclaimer: Orasa facilitates SMS delivery via third-party gateways (e.g., PhilSMS/iTexMo). We are not liable for undelivered or delayed messages caused by network outages or telco-side filtering (Globe, Smart, DITO).",
      'Anti-Spam: Users are strictly prohibited from using Orasa for "Smishing" or mass marketing. Accounts found violating NTC anti-spam regulations will be terminated immediately.',
    ],
  },
  {
    header: "3. Data Retention and Mandatory Deletion",
    content: [
      "The 1-Year Rule: To ensure system performance and data hygiene, all records (appointments, logs, and customer visit history) older than one (1) year (365 days) will be permanently and automatically deleted.",
      'User Responsibility: It is the User\'s sole responsibility to use the "Export" feature to download and archive their business data before the 1-year deletion threshold. Deleted data cannot be recovered.',
    ],
  },
  {
    header: "4. Limitation of Liability",
    content: [
      "Administrative Tool: Orasa is an administrative aid. It is not a medical record system. Users (e.g., PT Clinics) are solely responsible for the professional care and medical documentation of their clients.",
      'Service "As-Is": We provide Orasa on an "as-is" basis and are not liable for business losses, missed appointments, or data loss.',
    ],
  },
  {
    header: "Part 2: Data Privacy Policy (DPA 2012 Compliant)",
    content: ["In compliance with the Philippine Data Privacy Act of 2012."],
  },
  {
    header: "1. Information We Collect",
    content: [
      "User Data: We collect your name and email address via Google SSO. We do not store your Google password.",
      "Client Data: We collect names and mobile numbers of your clients solely to facilitate scheduling and SMS reminders.",
    ],
  },
  {
    header: "2. How We Use Data",
    content: [
      "Data is processed exclusively to provide appointment management and automated notifications.",
      "We share client mobile numbers with our authorized SMS Gateway providers strictly for message transmission. We never sell or rent your client lists to third parties.",
    ],
  },
  {
    header: "3. Security Measures",
    content: [
      'We implement restricted database access and secure authentication to prevent unauthorized "Marites" access to your business records.',
    ],
  },
  {
    header: "4. Your Rights",
    content: [
      "You have the right to access your data, correct errors, or request full account deletion. For inquiries regarding the Data Privacy Act, contact support@orasa.ph.",
    ],
  },
];

type TermsOnboardingFormProps = {
  onAccept: (acceptedAt: string) => void;
};

const TermsOnboardingForm = ({ onAccept }: TermsOnboardingFormProps) => {
  const [agreed, setAgreed] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Check if scrolled to bottom (allowing for a 2px margin of error)
    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 2) {
      setHasScrolledToBottom(true);
    }
  };

  // Check if content is already short enough that scrolling isn't needed
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    if (scrollEl.scrollHeight <= scrollEl.clientHeight) {
      // Defer state update to avoid cascading render warning
      requestAnimationFrame(() => {
        setHasScrolledToBottom(true);
      });
    }
  }, []);

  const handleContinue = () => {
    if (agreed) {
      onAccept(new Date().toISOString());
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Terms and Conditions</CardTitle>
        <CardDescription>Please read and accept our terms to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="bg-slate-100 p-4 rounded-md h-96 overflow-y-auto w-full text-sm text-slate-700 leading-relaxed border space-y-4"
        >
          {TERMS_AND_CONDITIONS.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <strong
                className={cn(
                  section.header.startsWith("Part") && "text-base uppercase tracking-wide text-foreground font-bold",
                )}
              >
                {section.header}
              </strong>
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph.includes(":") ? (
                    <>
                      <strong>{paragraph.split(":")[0]}:</strong>
                      {paragraph.substring(paragraph.indexOf(":") + 1)}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex items-center space-x-2 w-full justify-center transition-opacity duration-300",
            !hasScrolledToBottom && "opacity-50",
          )}
        >
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(c) => (hasScrolledToBottom ? setAgreed(c === true) : undefined)}
            disabled={!hasScrolledToBottom}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {hasScrolledToBottom ? "I accept the terms and conditions" : "Please scroll to the bottom to accept"}
          </label>
        </div>

        <Button className="w-full max-w-sm" disabled={!agreed} onClick={handleContinue}>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default TermsOnboardingForm;
