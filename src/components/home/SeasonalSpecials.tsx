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
    <div>
      <h2 className="text-lg font-semibold">Seasonal Specials</h2>
      <div className="mt-2 flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {promoBanners.map((b) => (
          <Card key={b.id} className="min-w-[260px] snap-start overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge>{b.tag}</Badge>
                <div className="text-[#B35300]">
                  <LotusIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 font-semibold">{b.title}</div>
              <div className="mt-1 text-sm text-slate-600">{b.subtitle}</div>
              <div className="mt-3">
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
