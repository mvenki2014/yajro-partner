import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ServiceCardProps } from "@/types";

export function ServiceCard({
                              id,
                              name,
                              description,
                              price,
                              duration,
                              popular,
                              image = "/images/service_dummy.png",
                              onSelect,
                            }: ServiceCardProps) {
  const formatDuration = (d?: string) => {
    if (!d) return "";
    return d
      .replace(/\s*(?:hrs|hr|hours|hour)\b/gi, "h")
      .replace(/\s*(?:mins|min|minutes|minute)\b/gi, "m")
      .replace(/(\d+)h\s+0m\b/g, "$1h")
      .replace(/^0h\s+(\d+)m\b/g, "$1m")
      .replace(/\s+/g, " ")
      .trim();
  };

  const displayDuration = formatDuration(duration);

  return (
    <Card className="overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => onSelect(id)}
        className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="relative flex gap-3">
          {/* Image Section - Reduced size for better balance */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200/50">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Content Area */}
          <div className="flex flex-1 flex-col min-w-0 py-0.5">
            <div className="flex justify-between items-start gap-2">
              {/* Title */}
              <div className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                {name}
              </div>

              {/* Popular Text - Top Right inside content */}
              {popular && (
                <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  Popular
                </span>
              )}
            </div>

            {/* Description - Smaller, line-clamped */}
            <div className="mt-1 text-xs text-slate-500 leading-snug line-clamp-1">
              {description}
            </div>

            {/* Price & Book Now - Same line */}
            <div className="mt-auto pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {displayDuration && (
                  <>
                    <span className="text-[11px] font-medium text-slate-500">{displayDuration}</span>
                    <span className="text-slate-300">•</span>
                  </>
                )}
                <span className="text-[13px] font-bold text-[#B35300]">
                  <span className="text-[10px] font-medium text-slate-500 mr-0.5">From</span> ₹{price.toLocaleString()}
                </span>
              </div>
              <Badge variant="saffron"
                     className="px-3 py-1 text-[11px] font-bold shadow-sm hover:scale-105 transition-transform active:scale-95">
                Book Now
              </Badge>
            </div>
          </div>
        </div>
      </button>
    </Card>
  );
}
