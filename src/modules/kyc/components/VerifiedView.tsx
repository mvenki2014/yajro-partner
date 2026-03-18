import { ShieldCheck, CreditCard, FileText, Landmark, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { type KycStatus } from "@/lib/api";
import { useSetShell } from "@/context/ShellContext";
import { KycStatusBanner } from "./KycStatusBanner";
import { KYC_MESSAGES } from "@/config/messageConstants";
import { mask } from "@/lib/mask";

interface VerifiedViewProps {
  status: KycStatus;
  data?: {
    aadharNumber?: string;
    panNumber?: string;
    accountNumber?: string;
    bankName?: string;
  };
  onBack: () => void;
}

export function VerifiedView({ status, data, onBack }: VerifiedViewProps) {
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

  return (
    <div className="space-y-4 pb-24 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/*<KycStatusBanner status={status} />*/}


      <div className="rounded-2xl  bg-gradient-to-br from-emerald-50/80 to-white/50 p-5 border border-emerald-100/40 shadow-inner flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100/50 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <p className="text-[12px] font-bold text-emerald-800 uppercase">🎉 KYC Verification Approved</p>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            You now have full access and higher payout limits
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm transition-all">
        {/* Decorative background element */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/5 blur-[50px]" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-15 w-15 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-50 ring-1 ring-emerald-200/50 shadow-inner ">
              <ShieldCheck className="h-8 w-8 text-emerald-500 animate-[pulse_3s_infinite]" />
            </div>

            <h2 className="mb-2 text-2xl font-black  text-slate-700">{ KYC_MESSAGES.statusVerified }</h2>
            <p className="mb-3 text-sm font-medium leading-relaxed text-slate-500">{KYC_MESSAGES.statusVerifiedDesc}</p>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Aadhaar",
                value: mask.aadhaar(data?.aadharNumber),
                icon: <CreditCard className="h-4 w-4" />
              },
              {
                label: "PAN",
                value: mask.panNumber(data?.panNumber),
                icon: <FileText className="h-4 w-4" />
              },
              {
                label: "Bank Account",
                value: `${data?.bankName || ""} •••• ${data?.accountNumber ? data.accountNumber.slice(-4) : ""}`,
                icon: <Landmark className="h-4 w-4" />
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/50 text-slate-400">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-slate-800">{item.label}</p>
                    <p className="text-[11px] font-medium text-slate-400 tracking-wider">{item.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="flex items-center justify-center gap-2 py-2">
        <Lock className="h-3 w-3 text-slate-400" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Your data is securely encrypted and stored
        </p>
      </div>


      <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white/50 p-5 border border-blue-100/40 text-center shadow-inner">

        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className="h-10 w-10 rounded-full bg-blue-100/50 flex items-center justify-center">
            <Lock className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <p className="text-[12px] font-semibold text-blue-800 uppercase tracking-wide">
          Encrypted & Secure
        </p>

        {/* Description */}
        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
          Your data is secured with AES-256 encryption and protected by industry-standard security practices.
        </p>

      </div>


      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-100 p-5 pb-[calc(env(safe-area-inset-bottom,0)+20px)]">
        <Button
          className="w-full h-14 rounded-2xl bg-[#FF9933] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(255,153,51,0.3)] transition-all active:scale-[0.97] hover:bg-[#e68a2e] flex items-center justify-center gap-3"
          onClick={onBack}
        >
          <span>Start Accepting Bookings</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
