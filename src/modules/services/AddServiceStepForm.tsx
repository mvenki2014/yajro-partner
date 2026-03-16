import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronRight, Check, Info, Package, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";
import appData from "@/data/app-data.json";
import { step1Schema, step2Schema, step3Schema } from "@/zod/serviceSchema";
import { z } from "zod";
import { Step1BasicInfo } from "./add-service-steps/Step1BasicInfo";
import { Step2Packages } from "./add-service-steps/Step2Packages";
import { Step3Finalize } from "./add-service-steps/Step3Finalize";

const STEP_IDS = {
  BASIC_INFO: "BASIC_INFO",
  PACKAGES: "PACKAGES",
  FINALIZE: "FINALIZE",
} as const;

type StepId = keyof typeof STEP_IDS;
type AdminCatalogService = (typeof appData.services)[number];

const steps = [
  { id: STEP_IDS.BASIC_INFO, title: "Select", icon: Info },
  { id: STEP_IDS.PACKAGES, title: "Service Info", icon: Package },
  { id: STEP_IDS.FINALIZE, title: "Finalize", icon: Settings2 },
];

const formatDuration = (durationMins: number) => {
  const hours = Math.floor(durationMins / 60);
  const minutes = durationMins % 60;
  return `${hours}h ${minutes}m`;
};

const buildServiceFromCatalog = (service: AdminCatalogService): Omit<PartnerService, "id"> => {
  const category = appData.categories.find((item) => item.id === service.categoryId)?.name || "Pooja";

  return {
    catalogServiceId: service.id,
    name: service.title,
    category,
    description: service.significance || service.subtitle,
    duration: formatDuration(service.durationMins),
    basePrice: service.baseFromPrice,
    customPrice: true,
    visitType: "Home Visit",
    requiredItems: service.requiredItems || [],
    enabled: true,
    image: undefined,
    packages: [],
    adminPackages: service.packages.map((pkg) => ({
      name: pkg.name,
      price: pkg.price,
      description: pkg.highlights?.join(", ") || pkg.name,
    })),
  };
};

const emptyService: Omit<PartnerService, "id"> = {
  catalogServiceId: undefined,
  name: "",
  category: "",
  description: "",
  duration: "0h 0m",
  basePrice: 0,
  customPrice: true,
  visitType: "Home Visit",
  requiredItems: [],
  enabled: true,
  packages: [],
  adminPackages: [],
};

export function AddServiceStepForm({
  onBack,
  initialData,
  onSave,
  isSaving,
}: {
  onBack: () => void;
  initialData?: PartnerService | null;
  onSave: (service: Omit<PartnerService, "id"> & { id?: string }) => Promise<void> | void;
  isSaving?: boolean;
}) {
  const [currentStep, setCurrentStep] = React.useState<StepId>(STEP_IDS.BASIC_INFO);
  const [formData, setFormData] = React.useState<Omit<PartnerService, "id">>(
    initialData ? { ...initialData } : emptyService
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const applyCatalogService = (catalogServiceId: string) => {
    const selectedService = appData.services.find((service) => service.id === catalogServiceId);
    if (!selectedService) {
      return;
    }

    setFormData((prev) => {
      const next = buildServiceFromCatalog(selectedService);
      return {
        ...next,
        image: prev.image,
        visitType: prev.visitType || next.visitType,
        customPrice: prev.customPrice,
        requiredItems: prev.requiredItems,
        enabled: prev.enabled,
        basePrice: prev.basePrice > 0 ? prev.basePrice : next.basePrice,
      };
    });
  };

  const handleFinalSave = async () => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await onSave({ ...formData, id: initialData.id });
      } else {
        await onSave(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    try {
      if (currentStep === STEP_IDS.BASIC_INFO) {
        step1Schema.parse(formData);
      } else if (currentStep === STEP_IDS.PACKAGES) {
        step2Schema.parse(formData);
      } else if (currentStep === STEP_IDS.FINALIZE) {
        step3Schema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const nextErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          nextErrors[issue.path.join("_")] = issue.message;
        });
        setErrors(nextErrors);
      }
      return false;
    }
  };

  const nextStep = async () => {
    if (!validateStep()) {
      return;
    }

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      setErrors({});
      return;
    }

    await handleFinalSave();
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      return;
    }
    onBack();
  };

  useSetShell({
    title: (
      <PageHeader
        title={initialData ? "Edit Service" : "Opt Service"}
        onBack={prevStep}
      />
    ),
    bottomNav: null,
  });

  const saving = isSaving || isSubmitting;

  return (
    <div className="space-y-4 pb-18 relative min-h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const currentIndex = steps.findIndex((item) => item.id === currentStep);
          const stepIndex = steps.findIndex((item) => item.id === step.id);
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
                    className={cn(
                      "h-full bg-[#FF9933] transition-all duration-500",
                      currentIndex > idx ? "w-full" : "w-0"
                    )}
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
              setErrors={setErrors}
              onSelectCatalogService={applyCatalogService}
              isEditMode={Boolean(initialData)}
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 z-50">
        <Button
          variant="secondary"
          className="flex-1 rounded-xl h-12 font-bold"
          onClick={prevStep}
          disabled={saving}
        >
          {currentStep === STEP_IDS.BASIC_INFO ? "Cancel" : "Back"}
        </Button>
        <Button
          className="flex-2 rounded-xl h-12 font-bold min-w-[140px]"
          onClick={nextStep}
          disabled={saving}
        >
          {saving ? "Saving..." : currentStep === STEP_IDS.FINALIZE ? "Save Service" : "Next Step"}
          {!saving && currentStep !== STEP_IDS.FINALIZE && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
