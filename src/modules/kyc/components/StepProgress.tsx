import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface StepProgressProps {
  steps: Step[];
  currentStepIndex: number;
}

export function StepProgress({ steps, currentStepIndex }: StepProgressProps) {
  const progressPercentage = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative px-2 py-4">
      <div className="absolute top-[34px] left-10 right-10 h-0.5 bg-slate-100 rounded-full" />
      <div
        className="absolute top-[34px] left-10 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500 rounded-full"
        style={{ width: `${progressPercentage * 0.8}%` }}
      />
      <div className="relative flex justify-between items-center">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2.5">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-500",
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                    : isActive
                    ? "border-[#FF9933] bg-white text-[#FF9933] shadow-lg shadow-orange-100 ring-4 ring-orange-50"
                    : "border-slate-100 bg-white text-slate-300"
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                  isActive ? "text-[#B35300]" : isCompleted ? "text-emerald-600/80" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
