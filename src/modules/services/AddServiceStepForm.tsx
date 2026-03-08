import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";
import { step1Schema, step2Schema, step3Schema } from "@/zod/serviceSchema";
import { z } from "zod";
import { Step1BasicInfo } from "./add-service-steps/Step1BasicInfo";
import { Step2Packages } from "./add-service-steps/Step2Packages";
import { Step3Finalize } from "./add-service-steps/Step3Finalize";
import { Info, Package, Settings2 } from "lucide-react";

const STEP_IDS = {
  BASIC_INFO: "BASIC_INFO",
  PACKAGES: "PACKAGES",
  FINALIZE: "FINALIZE",
} as const;

type StepId = keyof typeof STEP_IDS;

const steps = [
  { id: STEP_IDS.BASIC_INFO, title: "Basic Info", icon: Info },
  { id: STEP_IDS.PACKAGES, title: "Packages", icon: Package },
  { id: STEP_IDS.FINALIZE, title: "Finalize", icon: Settings2 },
];

const emptyService: Omit<PartnerService, "id"> = {
  name: "Ganesh Pooja",
  category: "Pooja",
  description: "Traditional Vrata Pooja",
  duration: "1h 30m",
  basePrice: 0,
  customPrice: false,
  visitType: "Home Visit",
  requiredItems: ["Coconut", "Flowers", "Betel Leaves"],
  enabled: true,
  packages: [
    { name: "Basic", price: 2500, description: "Standard Pooja with basic items" },
    { name: "Standard", price: 4000, description: "Comprehensive Pooja with materials" },
    { name: "Premium", price: 6000, description: "Grand Ritual with elaborate setup" },
  ],
};

export function AddServiceStepForm({ 
  onBack, 
  initialData, 
  onSave 
}: { 
  onBack: () => void; 
  initialData?: PartnerService | null;
  onSave: (service: Omit<PartnerService, "id"> & { id?: string }) => void;
}) {
  const [currentStep, setCurrentStep] = React.useState<StepId>(STEP_IDS.BASIC_INFO);
  const [formData, setFormData] = React.useState<Omit<PartnerService, "id">>(
    initialData ? { ...initialData } : emptyService
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFinalSave = () => {
    if (initialData) {
      onSave({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateStep = () => {
    try {
      if (currentStep === STEP_IDS.BASIC_INFO) {
        step1Schema.parse(formData);
      } else if (currentStep === STEP_IDS.PACKAGES) {
        step2Schema.parse({ packages: formData.packages });
      } else if (currentStep === STEP_IDS.FINALIZE) {
        step3Schema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join("_");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      const currentIndex = steps.findIndex(s => s.id === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id);
        setErrors({});
      } else {
        handleFinalSave();
      }
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    } else {
      onBack();
    }
  };

  useSetShell({
    title: (
      <PageHeader 
        title={initialData ? "Edit Service" : "Add New Service"} 
        onBack={prevStep}
      />
    ),
    bottomNav: null,
  });

  return (
    <div className="space-y-4 pb-18 relative min-h-full">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-4 px-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const currentIndex = steps.findIndex(s => s.id === currentStep);
          const stepIndex = steps.findIndex(s => s.id === step.id);
          const isActive = currentStep === step.id;
          const isCompleted = currentIndex > stepIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-white shadow-sm",
                    isActive ? "bg-[#FF9933] text-white scale-110" : 
                    isCompleted ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  isActive ? "text-[#FF9933]" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-200 -mt-6 mx-1">
                  <div 
                    className={cn("h-full bg-[#FF9933] transition-all duration-500", 
                    steps.findIndex(s => s.id === currentStep) > idx ? "w-full" : "w-0")} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Card className="p-3 border-none shadow-orange-100/50">
        <div className="space-y-4">
          {currentStep === STEP_IDS.BASIC_INFO && (
            <Step1BasicInfo 
              formData={formData}
              errors={errors}
              updateField={updateField}
              setErrors={setErrors}
              fileInputRef={fileInputRef}
            />
          )}

          {currentStep === STEP_IDS.PACKAGES && (
            <Step2Packages 
              formData={formData}
              errors={errors}
              updateField={updateField}
              setErrors={setErrors}
            />
          )}

          {currentStep === STEP_IDS.FINALIZE && (
            <Step3Finalize 
              formData={formData}
              updateField={updateField}
            />
          )}
        </div>
      </Card>

      {/* Floating Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 z-50">
        <Button
          variant="secondary"
          className="flex-1 rounded-xl h-12 font-bold"
          onClick={prevStep}
        >
          {currentStep === STEP_IDS.BASIC_INFO ? "Cancel" : "Back"}
        </Button>
        <Button
          className="flex-2 rounded-xl h-12 font-bold min-w-[140px]"
          onClick={nextStep}
        >
          {currentStep === STEP_IDS.FINALIZE ? "Save Service" : "Next Step"}
          {currentStep !== STEP_IDS.FINALIZE && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
