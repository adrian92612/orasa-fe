import BusinessOnboardingForm from "@/components/features/onboarding/BusinessOnboardingForm";
import ServiceOnboardingForm from "@/components/features/onboarding/ServiceOnboardingForm";
import StaffOnboardingForm from "@/components/features/onboarding/StaffOnboardingForm";
import { APP_ROUTES } from "@/constants/routes";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router";

type OnboardingStep = "business" | "service" | "staff";

type StepConfig = {
  id: OnboardingStep;
  label: string;
  title: string;
  description: string;
};

const STEPS: StepConfig[] = [
  {
    id: "business",
    label: "Business",
    title: "Register your business",
    description: "Tell us about your company to get started.",
  },
  {
    id: "service",
    label: "Services",
    title: "Add your services",
    description: "Define what you offer to your customers.",
  },
  {
    id: "staff",
    label: "Staff",
    title: "Set up your team",
    description: "Invite your staff members to the platform.",
  },
];

const OnboardingPage = () => {
  const { refetchUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("business");
  const [firstBranchId, setFirstBranchId] = useState<string | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);
  const currentStepData = STEPS[currentStepIndex];

  const handleBusinessSuccess = (branchId: string) => {
    setFirstBranchId(branchId);
    setStep("service");
  };

  const handleServiceNext = () => {
    setStep("staff");
  };

  const handleFinish = async () => {
    await refetchUser();
    navigate(APP_ROUTES.DASHBOARD.ANALYTICS);
  };

  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center py-12 bg-slate-50">
      <div className="w-full max-w-xl px-4">
        <nav className="mb-12 relative" aria-label="Progress">
          <ol className="flex items-center justify-between w-full">
            {STEPS.map((s, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <li
                  key={s.id}
                  className="relative flex flex-col items-center flex-1"
                >
                  {index !== STEPS.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-500 ${
                        index < currentStepIndex
                          ? "bg-blue-600"
                          : "bg-slate-200"
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      isActive || isCompleted
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <span className="text-sm font-bold">✓</span>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  <span
                    className={`mt-2 text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex flex-col items-center">
          <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {currentStepData.title}
            </h1>
            <p className="mt-2 text-slate-600">{currentStepData.description}</p>
          </header>

          <div className="w-full flex justify-center">
            {step === "business" && (
              <BusinessOnboardingForm onSuccess={handleBusinessSuccess} />
            )}
            {step === "service" && (
              <ServiceOnboardingForm onNext={handleServiceNext} />
            )}
            {step === "staff" && firstBranchId && (
              <StaffOnboardingForm
                branchId={firstBranchId}
                onFinish={handleFinish}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
