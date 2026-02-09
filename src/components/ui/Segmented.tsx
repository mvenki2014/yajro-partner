import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  sub?: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
}

export function Segmented<T extends string>({
                                              value,
                                              onChange,
                                              options,
                                              className,
                                            }: SegmentedProps<T>) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as T);
      }}
      className={cn("grid grid-cols-3 gap-2", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <ToggleGroupPrimitive.Item
            key={o.value}
            value={o.value}
            className={cn(
              "rounded-xl px-3 py-3 text-left ring-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]/50",
              active
                ? "bg-[#FF9933]/10 ring-[#FF9933]/40 shadow-sm"
                : "bg-white hover:bg-slate-50 ring-slate-200"
            )}
          >
            <div className={cn(
              "text-sm font-semibold",
              active ? "text-[#B35300]" : "text-slate-900"
            )}>
              {o.label}
            </div>
            {o.sub && (
              <div className={cn(
                "text-xs leading-snug mt-0.5",
                active ? "text-[#B35300]/70" : "text-slate-500"
              )}>
                {o.sub}
              </div>
            )}
          </ToggleGroupPrimitive.Item>
        );
      })}
    </ToggleGroupPrimitive.Root>
  );
}
