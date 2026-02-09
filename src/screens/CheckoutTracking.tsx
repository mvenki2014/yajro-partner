import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { services } from "@/data/mock";

const steps = [
  { id: "assigned", label: "Poojari assigned" },
  { id: "materials", label: "Materials dispatched" },
  { id: "enroute", label: "Poojari en route" },
  { id: "started", label: "Pooja started" },
] as const;


export function CheckoutTracking({
  serviceId,
  tierId,
  onBack,
  onReset,
}: {
  serviceId: string;
  tierId: string;
  onBack: () => void;
  onReset: () => void;
}) {
  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const tierObj = service.packages.find((p) => p.id === tierId) ?? service.packages[0];

  const [active, setActive] = React.useState<string>("assigned");

  const activeIndex = steps.findIndex((s) => s.id === active);

  const cost = {
    dakshina: tierObj.price,
    samagri: tierObj.includesSamagri ? 650 : 0,
    convenience: 49,
  };
  const total = cost.dakshina + cost.samagri + cost.convenience;

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
            <div className="truncate font-semibold">Checkout & tracking</div>
            <div className="text-xs text-slate-500 truncate">Summary + live status mock</div>
          </div>
          <Badge variant="saffron">₹{total}</Badge>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={onReset}>
            New booking
          </Button>
          <Button
            onClick={() => {
              const next = steps[Math.min(activeIndex + 1, steps.length - 1)].id;
              setActive(next);
            }}
          >
            Advance status
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-600">Payable amount</div>
              <div className="mt-1 text-2xl font-extrabold">₹{total}</div>
              <div className="mt-1 text-xs text-slate-500">Includes taxes & platform fee</div>
            </div>
            <Badge variant="success">Secure</Badge>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Dakshina (fees)" value={`₹${cost.dakshina}`} />
            <Row label="Samagri" value={`₹${cost.samagri}`} />
            <Row label="Convenience" value={`₹${cost.convenience}`} />
            <div className="h-px bg-slate-200 my-2" />
            <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">₹{total}</span>} />
          </div>
          <div className="mt-4">
            <Button className="w-full">Pay & confirm</Button>
            <div className="mt-2 text-xs text-slate-500">
              Mock checkout. No real payments.
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Live tracking</div>
                <div className="text-xs text-slate-500">Map is a visual mock</div>
              </div>
              <Badge variant="neutral">ETA 18 min</Badge>
            </div>
          </div>
          <div className="h-44 bg-[radial-gradient(circle_at_30%_20%,rgba(255,153,51,.25),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(34,197,94,.18),transparent_45%),linear-gradient(135deg,rgba(15,23,42,.03),rgba(255,255,255,.8))] relative">
            <div className="absolute left-6 top-8">
              <Pin label="Home" />
            </div>
            <div className="absolute right-10 bottom-8">
              <Pin label="Temple" tone="saffron" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 left-8"
              style={{
                transform: `translate(${activeIndex * 70}px, -50%)`,
                transition: "transform 600ms ease",
              }}
            >
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-2xl bg-white ring-1 ring-slate-200 grid place-items-center shadow-sm">
                  <span className="text-lg">🛕</span>
                </div>
                <div className="mt-1 text-[10px] font-semibold text-slate-700">Poojari</div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold">Status</div>
            <div className="mt-3 space-y-2">
              {steps.map((s, idx) => {
                const done = idx <= activeIndex;
                return (
                  <div key={s.id} className="flex items-start gap-3">
                    <div
                      className={
                        "mt-0.5 h-5 w-5 rounded-full grid place-items-center ring-1 " +
                        (done
                          ? "bg-emerald-500/15 ring-emerald-500/25 text-emerald-800"
                          : "bg-white ring-slate-200 text-slate-400")
                      }
                    >
                      {done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <span className="text-[10px]">•</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={done ? "text-sm font-semibold" : "text-sm"}>
                        {s.label}
                      </div>
                    </div>
                    {idx === activeIndex ? <Badge variant="saffron">Now</Badge> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-lg font-semibold">Items to keep ready</div>
          <div className="mt-2 text-sm text-slate-600">Helps the pooja begin on time.</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Deepam", "Flowers", "Asanam", "Fruits", "Water pot", "Camphor"].map((it) => (
              <div key={it} className="rounded-xl bg-slate-900/5 px-3 py-2 text-sm">
                {it}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-slate-600">{label}</div>
      <div className="text-slate-900">{value}</div>
    </div>
  );
}

function Pin({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "saffron" }) {
  const cls =
    tone === "saffron"
      ? "bg-[#FF9933]/15 ring-[#FF9933]/30 text-[#B35300]"
      : "bg-white ring-slate-200 text-slate-700";
  return (
    <div className="flex items-center gap-2">
      <div className={"h-9 w-9 rounded-2xl ring-1 grid place-items-center shadow-sm " + cls}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <div className="text-[11px] font-semibold text-slate-700 bg-white/70 rounded-full px-2 py-1 ring-1 ring-slate-200">
        {label}
      </div>
    </div>
  );
}
