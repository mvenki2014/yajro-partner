import { Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { type KycStatus } from "@/lib/api";
import { KYC_MESSAGES } from "@/config/messageConstants";
import { cn } from "@/lib/utils";

interface KycStatusBannerProps {
  status: KycStatus;
  rejectionReason?: string;
}

export function KycStatusBanner({ status, rejectionReason }: KycStatusBannerProps) {
  if (status === "NOT_SUBMITTED") return null;

  const config = {
    PENDING: {
      icon: <Clock className="h-5 w-5 animate-pulse text-amber-500" />,
      title: "Draft Saved",
      desc: "Complete your verification to access features",
      className: "bg-gradient-to-br from-white to-[#FFF6EA] border-slate-200/80 shadow-md",
      accent: "bg-amber-50",
      badge: "Pending",
      badgeClass: "bg-amber-100/50 text-amber-700 border-amber-200/30",
    },
    IN_REVIEW: {
      icon: <Clock className="h-5 w-5 animate-pulse text-amber-500" />,
      title: "Verification in Progress",
      desc: "Review usually takes 24-48 hours",
      className: "bg-gradient-to-br from-white to-[#FFF6EA] border-slate-200/80 shadow-md",
      accent: "bg-amber-50",
      badge: "In Review",
      badgeClass: "bg-amber-100/50 text-amber-700 border-amber-200/30",
    },
    REVIEW: {
      icon: <Clock className="h-5 w-5 animate-pulse text-amber-500" />,
      title: "Verification in Progress",
      desc: "Review usually takes 24-48 hours",
      className: "bg-gradient-to-br from-white to-[#FFF6EA] border-slate-200/80 shadow-md",
      accent: "bg-amber-50",
      badge: "In Review",
      badgeClass: "bg-amber-100/50 text-amber-700 border-amber-200/30",
    },
    APPROVED: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      title: KYC_MESSAGES.statusVerified,
      desc: KYC_MESSAGES.statusVerifiedDesc,
      className: "bg-gradient-to-br from-white to-[#FFF6EA] border-slate-200/80 shadow-md",
      accent: "bg-emerald-50",
      badge: "Verified",
      badgeClass: "bg-emerald-100/50 text-emerald-700 border-emerald-200/30",
    },
    REJECTED: {
      icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
      title: KYC_MESSAGES.statusRejected,
      desc: rejectionReason || KYC_MESSAGES.statusRejectedDesc,
      className: "bg-gradient-to-br from-white to-red-50/30 border-red-100 shadow-sm shadow-red-100/20",
      accent: "bg-red-50",
      badge: "Rejected",
      badgeClass: "bg-red-100/50 text-red-700 border-red-200/30",
    },
  }[status as "PENDING" | "IN_REVIEW" | "REVIEW" | "APPROVED" | "REJECTED"];

  if (!config) return null;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border p-4 transition-all duration-500",
      config.className
    )}>
      <div className="relative z-10 flex items-center gap-4">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5", config.accent)}>
          {config.icon}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[15px] font-black text-slate-800">
              {config.title}
            </h3>
            <div className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest", config.badgeClass)}>
              {config.badge}
            </div>
          </div>
          <p className="line-clamp-1 text-[11px] font-medium text-slate-500/90 antialiased">
            {config.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
