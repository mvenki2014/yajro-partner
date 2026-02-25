import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LotusIcon } from "@/components/icons/VedicIcons";
import { promoBanners } from "@/data/mock";

interface SeasonalSpecialsProps {
  onOpenBooking: () => void;
}

export function SeasonalSpecials({ onOpenBooking }: SeasonalSpecialsProps) {
  return (
    <div className="mb-1">
        <div className="flex items-end justify-between mb-2">
          <label className="text-base font-semibold block">
            Seasonal Specials
          </label>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide px-2">
        {promoBanners.map((b) => (
          <Card key={b.id} className="min-w-[260px] ring-0 shadow-sm snap-start rounded-2xl overflow-hidden border">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge>{b.tag}</Badge>
                <div className="text-[#B35300]">
                  <LotusIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="my-2 font-semibold text-[#311c17]">{b.title}</div>
              <img src={b.image} className="w-full h-[150px] object-cover rounded-xl border" alt={b.title} />
              <div className="mt-1 text-sm text-[#311c17] leading-[18px] mt-[6px]">{b.subtitle}</div>
              <div className="mt-3 d-none hidden">
                <Button variant="secondary" className="w-full" onClick={onOpenBooking}>
                  Explore offers
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
