import { ServiceCard } from "@/components/ui/ServiceCard";
import { Service } from "@/types";

interface PopularServicesProps {
  services: Service[];
  onSelectService: (id: string) => void;
}

export function PopularServices({ services, onSelectService }: PopularServicesProps) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-semibold">Popular Services</h2>
        <div className="text-xs text-slate-500">From ₹799</div>
      </div>
      <div className="mt-3 space-y-3">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            id={s.id}
            name={s.title}
            description={s.subtitle}
            price={s.baseFromPrice}
            duration={`${Math.floor(s.durationMins / 60)}h ${s.durationMins % 60}m`}
            popular={true}
            image="/images/service_dummy.png"
            onSelect={onSelectService}
          />
        ))}
      </div>
    </div>
  );
}
