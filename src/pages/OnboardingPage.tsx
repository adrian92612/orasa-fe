import BusinessOnboardingForm from "@/components/features/onboarding/BusinessOnboardingForm";
import ServiceOnboardingForm from "@/components/features/onboarding/ServiceOnboardingForm";
import StaffOnboardingForm from "@/components/features/onboarding/StaffOnboardingForm";
import { API_ROUTES, APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

type OnboardingStep = "business" | "service" | "staff";

const OnboardingPage = () => {
  const { isLoading, refetchUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("business");
  const [firstBranchId, setFirstBranchId] = useState<string | null>(null);

  const { mutate: completeOnboarding } = useMutation({
    mutationFn: async () => {
      return await apiClient.post(
        API_ROUTES.BUSINESSES.COMPLETE_ONBOARDING,
        {},
      );
    },
    onSuccess: async () => {
      await refetchUser();
      navigate(APP_ROUTES.DASHBOARD.ANALYTICS);
    },
    onError: (error) => {
      console.error("Failed to complete onboarding", error);
    },
  });

  const handleBusinessSuccess = (branchId: string) => {
    setFirstBranchId(branchId);
    setStep("service");
  };

  const handleServiceNext = () => {
    setStep("staff");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFinish = () => {
    completeOnboarding();
  };

  return (
    <main className="min-h-dvh w-full flex items-center justify-center p-4 bg-slate-50">
      {step === "business" && (
        <BusinessOnboardingForm onSuccess={handleBusinessSuccess} />
      )}
      {step === "service" && (
        <ServiceOnboardingForm onNext={handleServiceNext} />
      )}
      {step === "staff" && firstBranchId && (
        <StaffOnboardingForm branchId={firstBranchId} onFinish={handleFinish} />
      )}
    </main>
  );
};

export default OnboardingPage;
