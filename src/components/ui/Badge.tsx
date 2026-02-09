import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF9933]/15 text-[#B35300] ring-1 ring-[#FF9933]/30",
        secondary: "bg-[#FF9933]/15 text-[#B35300] ring-1 ring-[#FF9933]/30",
        saffron:
          "bg-[#FF9933]/15 text-[#B35300] ring-1 ring-[#FF9933]/30",
        gold:
          "bg-amber-400/20 text-amber-900 ring-1 ring-amber-400/35",
        neutral:
          "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
        success:
          "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/25",
        destructive:
          "bg-red-500/15 text-red-800 ring-1 ring-red-500/25",
        outline:
          "bg-transparent text-slate-700 ring-1 ring-slate-300",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}


function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
