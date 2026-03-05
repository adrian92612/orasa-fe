import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

import { TERMS_AND_CONDITIONS, PRIVACY_POLICY } from "@/constants/legal";

const ALL_TERMS = [...TERMS_AND_CONDITIONS, ...PRIVACY_POLICY];

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

    if (Math.abs(scrollHeight - clientHeight - scrollTop) < 2) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    if (scrollEl.scrollHeight <= scrollEl.clientHeight) {
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
          className="p-4 rounded-md h-96 overflow-y-auto w-full text-sm leading-relaxed border space-y-4"
        >
          {ALL_TERMS.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <strong
                className={cn(
                  section.header.startsWith("Part") && "text-base uppercase tracking-wide text-foreground font-bold",
                )}
              >
                {section.header}
              </strong>
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-foreground/80">
                  {paragraph.includes(":") ? (
                    <>
                      <strong className="text-foreground">{paragraph.split(":")[0]}:</strong>
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
