import {Card} from "@/components/ui/Card.tsx";

interface Offer {
  id: string;
  title: string;
  code: string;
  desc: string;
  bg: string;
  border: string;
  text: string;
  codeBg: string;
}

const offers: Offer[] = [
  {
    id: "offer1",
    title: "10% Off First Pooja",
    code: "FIRST10",
    desc: "Valid for all home ceremonies. Max discount ₹500.",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-700",
    codeBg: "bg-emerald-500/20",
  },
  {
    id: "offer2",
    title: "Free Samagri Delivery",
    code: "FREEDEL",
    desc: "On Premium & Standard packages above ₹2000.",
    bg: "bg-[#FF9933]/10",
    border: "border-[#FF9933]/20",
    text: "text-[#B35300]",
    codeBg: "bg-[#FF9933]/20",
  },
  {
    id: "offer3",
    title: "Festive Cashback",
    code: "FESTIVE200",
    desc: "Flat ₹200 cashback in your Yajro wallet.",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-700",
    codeBg: "bg-blue-500/20",
  }
];

export function OffersSection() {
  return (
    <div className="mb-1">
      <div className="flex items-end justify-between mb-2">
        <label className="text-base font-semibold block">
          Offers & Discounts
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {offers.map((o) => (
          <Card key={o.id} className={`min-w-[180px] ring-0 shadow-none snap-start rounded-2xl border border-dashed ${o.border} ${o.bg} p-3 relative overflow-hidden`}>
            <div className={`text-sm font-bold ${o.text}`}>{o.title}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className={`px-2.5 py-1 text-xs font-bold tracking-widest rounded-sm ${o.codeBg} ${o.text}`}>
                {o.code}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
