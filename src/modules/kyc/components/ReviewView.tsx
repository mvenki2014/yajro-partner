import { ShieldCheck, CreditCard, FileText, Landmark, CheckCircle2, ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { type KycStatus } from "@/lib/api";
import { useSetShell } from "@/context/ShellContext";
import { cn } from "@/lib/utils";
import { KycStatusBanner } from "./KycStatusBanner";

interface ReviewViewProps {
  status: KycStatus;
  rejectionReason?: string;
  onBack: () => void;
}

export function ReviewView({ status, rejectionReason, onBack }: ReviewViewProps) {
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
    <div className="space-y-5 pb-24 pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <KycStatusBanner status={status} rejectionReason={rejectionReason} />

      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm transition-all">
        {/* Decorative background element */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-400/5 blur-[50px]" />
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-400/5 blur-[50px]" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-700">Verification</h4>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Processing Details</p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-200/40 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-orange-400" />
            </div>
          </div>

          <div className="space-y-3 mb-2">
            {[
              { label: "Aadhaar Details", status: "In Review", icon: <CreditCard className="h-4 w-4" />, completed: false },
              { label: "PAN Verification", status: "Pending", icon: <FileText className="h-4 w-4" />, completed: false },
              { label: "Bank Account", status: "Pending", icon: <Landmark className="h-4 w-4" />, completed: false },
            ].map((item, idx) => (
              <div key={idx} className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-300",
                item.completed ? "bg-emerald-50/50 ring-1 ring-emerald-100/50" : "bg-white/60 ring-1 ring-slate-100 shadow-sm"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    item.completed ? "bg-emerald-100 text-emerald-600 shadow-sm" : "bg-slate-100/50 text-slate-400"
                  )}>
                    {item.completed ? <CheckCircle2 className="h-5 w-5" /> : item.icon}
                  </div>
                  <div>
                    <span className={cn("text-[13px] font-bold block", item.completed ? "text-emerald-700/80" : "text-slate-600")}>{item.label}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      item.status === "In Review" ? "text-amber-700" : (item.completed ? "text-emerald-600/60" : "text-slate-400")
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
                {!item.completed && (
                  <div className="flex h-5 w-5 items-center justify-center">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(255,153,51,0.5)]",
                      idx === 0 ? "bg-orange-500 animate-ping" : "bg-slate-300"
                    )} />
                  </div>
                )}
              </div>
            ))}

            <div className="mt-2 rounded-lg bg-emerald-50/50 p-3 ring-1 ring-emerald-200/50">
              <p className="text-[10px] font-bold text-emerald-700 leading-relaxed">
                You'll receive a notification once your verification is complete.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-100 p-5 pb-[calc(env(safe-area-inset-bottom,0)+20px)]">
        <div className="space-y-4">
          <Button
            className="w-full h-14 rounded-2xl bg-[#FF9933] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(255,153,51,0.3)] transition-all active:scale-[0.97] hover:bg-[#e68a2e] flex items-center justify-center gap-3"
            onClick={onBack}
          >
            <span>Back to Dashboard</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Submission successful • Continuing usage enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
