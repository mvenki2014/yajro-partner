import * as React from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  FileText,
  AlertCircle,
  Lock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { kycApi, type KycData, type KycStatus } from "@/lib/api";
import { kycSchema, type KycFormValues } from "@/zod/kycSchema";
import { KYC_MESSAGES } from "@/config/messageConstants";
import { AUTH_QUERY_KEY, useAuth } from "@/hooks/useAuth";
import { useSetShell } from "@/context/ShellContext";
import { cn } from "@/lib/utils";

import { DocumentUpload } from "./components/DocumentUpload";
import { SectionCard } from "./components/SectionCard";
import { StepProgress } from "./components/StepProgress";
import { mask } from "@/lib/mask";

export const KYC_QUERY_KEY = ["kyc"];

interface KycFormScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

type KycStep = "aadhaar" | "pan" | "bank" | "preview";

export function KycFormScreen({ onBack, onSuccess }: KycFormScreenProps) {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  const [currentStep, setCurrentStep] = React.useState<KycStep>("aadhaar");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [files, setFiles] = React.useState<Record<string, File>>({});

  const { data: kycData, isLoading } = useQuery<KycData | null>({
    queryKey: KYC_QUERY_KEY,
    queryFn: kycApi.get,
    staleTime: 5 * 60 * 1000,
  });

  const status: KycStatus = kycData?.kycStatus?.toUpperCase() as KycStatus ?? "NOT_SUBMITTED";
  const isVerified = status === "APPROVED";
  const isReview = status === "REVIEW" || status === "IN_REVIEW";
  const isReadOnly = isVerified || isReview;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      aadhaarNumber: kycData?.aadharNumber ?? "",
      aadhaarFront: kycData?.aadharFPath ?? "",
      aadhaarBack: kycData?.aadharBPath ?? "",
      panNumber: kycData?.panNumber ?? "",
      panDocument: kycData?.panPath ?? "",
      accountHolderName: kycData?.accountHolderName ?? "",
      accountNumber: kycData?.accountNumber ?? "",
      ifscCode: kycData?.ifscCode ?? "",
      bankName: kycData?.bankName ?? "",
    },
  });

  React.useEffect(() => {
    if (!kycData) return;
    setValue("aadhaarNumber", kycData.aadharNumber || "");
    setValue("aadhaarFront", kycData.aadharFPath || "");
    setValue("aadhaarBack", kycData.aadharBPath || "");
    setValue("panNumber", kycData.panNumber || "");
    setValue("panDocument", kycData.panPath || "");
    setValue("accountHolderName", kycData.accountHolderName || "");
    setValue("accountNumber", kycData.accountNumber || "");
    setValue("ifscCode", kycData.ifscCode || "");
    setValue("bankName", kycData.bankName || "");
  }, [kycData, setValue]);

  const onSubmit = async (values: KycFormValues) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("acceptedTerms", String(acceptedTerms));

      const response = await kycApi.submitStep("review", formData);
      queryClient.setQueryData(KYC_QUERY_KEY, response);

      if (response.kycStatus === "APPROVED") {
        updateUser({ isKycVerified: true });
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      }
      toast.success(KYC_MESSAGES.toastSubmitSuccess);
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEY });
      
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || KYC_MESSAGES.toastSubmitError);
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === "aadhaar") {
      isValid = await trigger(["aadhaarNumber", "aadhaarFront", "aadhaarBack"]);
      if (isValid) {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("aadhaarNumber", watch("aadhaarNumber"));
          if (files.aadhaarFront) formData.append("aadhaar_f", files.aadhaarFront);
          if (files.aadhaarBack) formData.append("aadhaar_b", files.aadhaarBack);

          const response = await kycApi.submitStep("aadhaar", formData);
          if (response.extractedData?.aadhaarNumber) {
            setValue("aadhaarNumber", response.extractedData.aadhaarNumber);
          }
          setCurrentStep("pan");
        } catch (err: any) {
          toast.error(err.message || "Failed to save Aadhaar details");
        } finally {
          setIsUploading(false);
        }
      }
    } else if (currentStep === "pan") {
      isValid = await trigger(["panNumber", "panDocument"]);
      if (isValid) {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("panNumber", watch("panNumber"));
          if (files.panDocument) formData.append("pan_document", files.panDocument);

          const response = await kycApi.submitStep("pan", formData);
          if (response.extractedData?.panNumber) {
            setValue("panNumber", response.extractedData.panNumber);
          }
          setCurrentStep("bank");
        } catch (err: any) {
          toast.error(err.message || "Failed to save PAN details");
        } finally {
          setIsUploading(false);
        }
      }
    } else if (currentStep === "bank") {
      isValid = await trigger([
        "accountHolderName",
        "accountNumber",
        "ifscCode",
        "bankName",
      ]);
      if (isValid) {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("accountHolderName", watch("accountHolderName"));
          formData.append("accountNumber", watch("accountNumber"));
          formData.append("ifscCode", watch("ifscCode"));
          formData.append("bankName", watch("bankName"));

          await kycApi.submitStep("bank", formData);
          setCurrentStep("preview");
        } catch (err: any) {
          toast.error(err.message || "Failed to save Bank details");
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep === "pan") setCurrentStep("aadhaar");
    if (currentStep === "bank") setCurrentStep("pan");
    if (currentStep === "preview") setCurrentStep("bank");
  };

  const steps = [
    { id: "aadhaar" as const, label: "Aadhaar", icon: <FileText className="h-4 w-4" /> },
    { id: "pan" as const, label: "PAN", icon: <CreditCard className="h-4 w-4" /> },
    { id: "bank" as const, label: "Bank", icon: <Landmark className="h-4 w-4" /> },
    { id: "preview" as const, label: "Review", icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  useSetShell({
    title: (
      <PageHeader
        title="KYC Verification"
        subtitle="Your data is safe and encrypted"
        onBack={onBack}
        rightElement={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 ring-1 ring-emerald-100">
              <Lock className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Encrypted</span>
            </div>
          </div>
        }
      />
    ),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF9933]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-2 pt-1">
        <StepProgress steps={steps} currentStepIndex={currentStepIndex} />

        {currentStep === "aadhaar" && (
          <SectionCard icon={<FileText className="h-5 w-5" />} title={KYC_MESSAGES.sectionAadhaar}>
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Aadhaar Number</Label>
              <Input
                placeholder="Enter 12-digit Aadhaar number"
                maxLength={12}
                className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold transition-all focus:bg-white focus:ring-[#FF9933]/20"
                disabled={isReadOnly}
                {...register("aadhaarNumber")}
              />
              {errors.aadhaarNumber && (
                <p className="text-xs font-semibold text-red-500 ml-1">{errors.aadhaarNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <DocumentUpload
                label={KYC_MESSAGES.uploadFront}
                value={watch("aadhaarFront")}
                onChange={(v) => setValue("aadhaarFront", v, { shouldValidate: true })}
                onFileSelect={(file) => setFiles(prev => ({ ...prev, aadhaarFront: file }))}
                error={errors.aadhaarFront?.message}
                disabled={isReadOnly}
              />

              <DocumentUpload
                label={KYC_MESSAGES.uploadBack}
                value={watch("aadhaarBack")}
                onChange={(v) => setValue("aadhaarBack", v, { shouldValidate: true })}
                onFileSelect={(file) => setFiles(prev => ({ ...prev, aadhaarBack: file }))}
                error={errors.aadhaarBack?.message}
                disabled={isReadOnly}
              />
            </div>
          </SectionCard>
        )}

        {currentStep === "pan" && (
          <SectionCard icon={<CreditCard className="h-5 w-5" />} title={KYC_MESSAGES.sectionPan}>
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">PAN Number</Label>
              <Input
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold uppercase transition-all focus:bg-white focus:ring-[#FF9933]/20"
                disabled={isReadOnly}
                {...register("panNumber", {
                  setValueAs: (v: string) => v.toUpperCase(),
                })}
              />
              {errors.panNumber && (
                <p className="text-xs font-semibold text-red-500 ml-1">{errors.panNumber.message}</p>
              )}
            </div>

            <DocumentUpload
              label={KYC_MESSAGES.uploadDoc}
              value={watch("panDocument")}
              onChange={(v) => setValue("panDocument", v, { shouldValidate: true })}
              onFileSelect={(file) => setFiles(prev => ({ ...prev, panDocument: file }))}
              error={errors.panDocument?.message}
              disabled={isReadOnly}
            />
          </SectionCard>
        )}

        {currentStep === "bank" && (
          <SectionCard icon={<Landmark className="h-5 w-5" />} title={KYC_MESSAGES.sectionBank}>
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Account Holder Name</Label>
                <Input
                  placeholder="Name as on bank account"
                  className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold transition-all focus:bg-white focus:ring-[#FF9933]/20"
                  disabled={isReadOnly}
                  {...register("accountHolderName")}
                />
                {errors.accountHolderName && (
                  <p className="text-xs font-semibold text-red-500 ml-1">{errors.accountHolderName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Account Number</Label>
                <Input
                  placeholder="Enter bank account number"
                  maxLength={18}
                  className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold transition-all focus:bg-white focus:ring-[#FF9933]/20"
                  disabled={isReadOnly}
                  {...register("accountNumber")}
                />
                {errors.accountNumber && (
                  <p className="text-xs font-semibold text-red-500 ml-1">{errors.accountNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">IFSC Code</Label>
                <Input
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold uppercase transition-all focus:bg-white focus:ring-[#FF9933]/20"
                  disabled={isReadOnly}
                  {...register("ifscCode", {
                    setValueAs: (v: string) => v.toUpperCase(),
                  })}
                />
                {errors.ifscCode && (
                  <p className="text-xs font-semibold text-red-500 ml-1">{errors.ifscCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Bank Name</Label>
                <Input
                  placeholder="e.g. State Bank of India"
                  className="h-12 rounded-2xl border-slate-200 bg-white/50 text-base font-semibold transition-all focus:bg-white focus:ring-[#FF9933]/20"
                  disabled={isReadOnly}
                  {...register("bankName")}
                />
                {errors.bankName && (
                  <p className="text-xs font-semibold text-red-500 ml-1">{errors.bankName.message}</p>
                )}
              </div>
            </div>
          </SectionCard>
        )}

        {currentStep === "preview" && (
          <div className="space-y-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card>
              <CardHeader className="flex-row items-center gap-3 border-b border-slate-50 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FF9933]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold">Review Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aadhaar Number</Label>
                    <p className="text-sm font-bold text-slate-900">{watch("aadhaarNumber")}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PAN Number</Label>
                    <p className="text-sm font-bold text-slate-900 uppercase">{watch("panNumber")}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Bank Information</h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Holder</Label>
                      <p className="text-sm font-bold text-slate-900">{watch("accountHolderName")}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank Name</Label>
                      <p className="text-sm font-bold text-slate-900">{watch("bankName")}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Number</Label>
                      <p className="text-sm font-bold text-slate-900">{watch("accountNumber")}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">IFSC Code</Label>
                      <p className="text-sm font-bold text-slate-900 uppercase">{watch("ifscCode")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl bg-orange-50/50 p-5 ring-1 ring-orange-100 shadow-sm transition-all hover:bg-orange-50/80">
              <div className="flex items-start gap-3.5">
                <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="peer h-5 w-5 rounded-lg border-2 border-orange-200 bg-white text-[#FF9933] transition-all cursor-pointer appearance-none checked:bg-[#FF9933] checked:border-transparent focus:ring-2 focus:ring-[#FF9933]/20"
                  />
                  <CheckCircle2 className="pointer-events-none absolute h-4 w-4 scale-0 text-white transition-all peer-checked:scale-100" />
                </div>
                <Label htmlFor="terms" className="text-[11px] text-slate-500 cursor-pointer select-none">
                  I hereby confirm that all the details provided above are correct and belong to me. I agree to the <span className="text-[#FF9933] font-bold underline underline-offset-2">Terms & Conditions</span>.
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/60 bg-white/80 p-4 backdrop-blur-xl pb-safe">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {currentStep !== "aadhaar" && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="h-14 w-14 rounded-2xl border-slate-200 bg-white shadow-sm"
              disabled={isUploading}
            >
              <ChevronLeft className="h-6 w-6 text-slate-600" />
            </Button>
          )}
          <Button
            onClick={currentStep === "preview" ? handleSubmit(onSubmit) : nextStep}
            className={cn(
              "h-14 flex-1 rounded-2xl text-base font-bold shadow-lg shadow-[#FF9933]/20 transition-all active:scale-[0.98]",
              "bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"
            )}
            disabled={isUploading || (currentStep === "preview" && !acceptedTerms)}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : currentStep === "preview" ? (
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                {KYC_MESSAGES.submitButton}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {KYC_MESSAGES.nextButton}
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Missing imports that might be needed or were in original file
import { CheckCircle2 as CheckCircle2Icon, Loader2 as Loader2Icon } from "lucide-react";
