import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { poojaris, services } from "@/data/mock";

export function ServiceDetail({
  serviceId,
  onBack,
  onContinue,
}: {
  serviceId: string;
  onBack: () => void;
  onContinue: (tierId: string) => void;
}) {
  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const [tier, setTier] = React.useState<string>(service.packages[0]?.id || "silver");
  const [language, setLanguage] = React.useState(service.languages[0]);

  const tierObj = service.packages.find((p) => p.id === tier) ?? service.packages[0];
  const recommended = poojaris.filter((p) => p.specialties.some((sp) => service.title.includes(sp.split(" ")[0])));

  const formatDuration = (d: string) => {
    return d
      .replace(/\s*(?:hrs|hr|hours|hour)\b/gi, "h")
      .replace(/\s*(?:mins|min|minutes|minute)\b/gi, "m")
      .replace(/(\d+)h\s+0m\b/g, "$1h")
      .replace(/^0h\s+(\d+)m\b/g, "$1m")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl p-2 hover:bg-slate-900/5"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{service.title}</div>
            <div className="text-xs text-slate-500 truncate">Service details & customization</div>
          </div>
          <Badge variant="saffron">{formatDuration(`${Math.floor(service.durationMins / 60)}h ${service.durationMins % 60}m`)}</Badge>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Selected package</div>
            <div className="text-sm font-semibold">{tierObj.name} • ₹{tierObj.price}</div>
          </div>
          <Button onClick={() => onContinue(tier)} className="shrink-0">
            Continue
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="text-sm text-slate-600">{service.subtitle}</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#FF9933]/10 p-3">
              <div className="text-xs font-semibold text-slate-700">Duration</div>
              <div className="mt-1 text-sm font-bold">
                {formatDuration(`${Math.floor(service.durationMins / 60)}h ${service.durationMins % 60}m`)}
              </div>
            </div>
            <div className="rounded-xl bg-amber-200/25 p-3">
              <div className="text-xs font-semibold text-slate-700">Significance</div>
              <div className="mt-1 text-xs text-slate-600 line-clamp-3">
                {service.significance}
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-lg font-semibold">Choose package</h2>
          <div className="mt-3">
            <Segmented
              value={tier}
              onChange={setTier}
              options={service.packages.map((p) => ({
                value: p.id,
                label: p.name,
                sub: p.includesSamagri ? "Pooja + Samagri" : "Pooja only",
              }))}
            />
          </div>
          <div className="mt-3 space-y-2">
            {tierObj.highlights.map((h) => (
              <div key={h} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF9933]" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Language preference</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.languages.map((l) => {
              const active = l === language;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={
                    "rounded-full px-3 py-2 text-xs font-semibold ring-1 transition " +
                    (active
                      ? "bg-[#FF9933]/15 ring-[#FF9933]/35 text-[#B35300]"
                      : "bg-white ring-slate-200 text-slate-700 hover:bg-slate-50")
                  }
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Recommended poojaris</h2>
          <div className="mt-3 space-y-3">
            {(recommended.length ? recommended : poojaris).slice(0, 2).map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold truncate">{p.name}</div>
                      {p.verified ? <Badge variant="success">Verified</Badge> : null}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 truncate">{p.templeAffiliation}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      ⭐ {p.rating.toFixed(1)} • {p.experienceYears}+ yrs • {p.languages.join(", ")}
                    </div>
                  </div>
                  <Button size="xs" variant="secondary" onClick={() => onContinue(tier)}>
                    Select
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
