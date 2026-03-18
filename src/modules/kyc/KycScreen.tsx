import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { kycApi, type KycData, type KycStatus } from "@/lib/api";
import { useSetShell } from "@/context/ShellContext";
import { cn } from "@/lib/utils";

import { KycStatusBanner } from "./components/KycStatusBanner";
import { VerifiedView } from "./components/VerifiedView";
import { ReviewView } from "./components/ReviewView";

export const KYC_QUERY_KEY = ["kyc"];

interface KycScreenProps {
  onBack: () => void;
}

export function KycScreen({ onBack }: KycScreenProps) {
  const navigate = useNavigate();
  const { data: kycData, isLoading } = useQuery<KycData | null>({
    queryKey: KYC_QUERY_KEY,
    queryFn: kycApi.get,
    staleTime: 5 * 60 * 1000,
  });

  const status: KycStatus = kycData?.kycStatus?.toUpperCase() as KycStatus ?? "NOT_SUBMITTED";
  const isVerified = status === "APPROVED";
  const isReview = status === "REVIEW" || status === "IN_REVIEW";

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-orange-500 opacity-20" />
        </div>
        <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <VerifiedView
        status={status}
        data={{
          aadharNumber: kycData?.aadharNumber,
          panNumber: kycData?.panNumber,
          accountNumber: kycData?.accountNumber,
          bankName: kycData?.bankName,
        }}
        onBack={onBack}
      />
    );
  }

  if (isReview) {
    return <ReviewView status={status} rejectionReason={kycData?.rejectionReason} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-4">
        <KycStatusBanner status={status} rejectionReason={kycData?.rejectionReason} />

        <div className="mt-8 flex flex-col items-center justify-center text-center space-y-6 px-4">
          <div className="h-20 w-20 rounded-3xl bg-orange-50 flex items-center justify-center ring-1 ring-orange-100 shadow-sm">
            <ShieldCheck className="h-10 w-10 text-[#FF9933]" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Verify Your Identity</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
              Complete your KYC to unlock all features, accept bookings, and receive payouts.
            </p>
          </div>

          <div className="w-full space-y-3 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-100/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700 leading-none">Aadhaar & PAN</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Identity Documents</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-100/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700 leading-none">Bank Details</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Payout Information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/60 bg-white/80 p-4 backdrop-blur-xl pb-safe">
        <Button
          onClick={() => navigate("/kyc/form")}
          className={cn(
            "h-14 w-full rounded-2xl text-base font-bold uppercase tracking-wider shadow-lg shadow-[#FF9933]/20 transition-all active:scale-[0.98]",
            "bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"
          )}
        >
          <span className="flex items-center gap-2">
            {status === "REJECTED" ? "Re-submit KYC" : "Start Verification"}
            <ChevronRight className="h-5 w-5" />
          </span>
        </Button>
      </div>
    </div>
  );
}
