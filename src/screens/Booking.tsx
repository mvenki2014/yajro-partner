import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { shubhDaysISO } from "@/data/mock";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { reverseGeocode } from "@/lib/location";

// Fix Leaflet marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  React.useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function LocationMarker({ 
  position, 
  setPosition,
  onLocationChange
}: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  onLocationChange: (address: string) => void
}) {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      reverseGeocode(newPos[0], newPos[1]).then(data => {
        if (data) onLocationChange(data.address);
      });
    },
  });

  return position ? <Marker position={position} /> : null;
}

function toISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const timeSlots = [
  { id: "morning", label: "Morning", sub: "6:00 AM – 11:00 AM" },
  { id: "afternoon", label: "Afternoon", sub: "11:00 AM – 4:00 PM" },
  { id: "evening", label: "Evening", sub: "4:00 PM – 9:00 PM" },
] as const;

export function Booking({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}) {
  const today = new Date();
  const locationData = useSelector((state: RootState) => state.location.data);
  const [selectedDate, setSelectedDate] = React.useState(toISO(today));
  const [slot, setSlot] = React.useState<string>(
    "morning"
  );
  const [address, setAddress] = React.useState(locationData?.address || "Plot 12, Lakshmi Nagar, Hyderabad");
  const [position, setPosition] = React.useState<[number, number]>(
    locationData?.latitude && locationData?.longitude 
      ? [locationData.latitude, locationData.longitude] 
      : [17.4483, 78.3915]
  );

  const next7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = toISO(d);
    const shubh = shubhDaysISO.includes(iso);
    return { iso, d, shubh };
  });

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
            <div className="truncate font-semibold">Booking & scheduling</div>
            <div className="text-xs text-slate-500 truncate">Pick shubh date, time & location</div>
          </div>
          <Badge variant="success">Shubh din</Badge>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Next</div>
            <div className="text-sm font-semibold">Checkout & tracking</div>
          </div>
          <Button onClick={onConfirm}>Continue</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Choose date</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {next7.map(({ iso, d, shubh }) => {
              const active = iso === selectedDate;
              const day = d.toLocaleDateString(undefined, { weekday: "short" });
              const date = d.getDate();
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={
                    "min-w-[84px] rounded-2xl p-3 text-left ring-1 transition " +
                    (active
                      ? "bg-[#FF9933]/12 ring-[#FF9933]/35"
                      : "bg-white ring-slate-200 hover:bg-slate-50")
                  }
                >
                  <div className="text-xs font-semibold text-slate-600">{day}</div>
                  <div className="mt-1 text-lg font-bold">{date}</div>
                  <div className="mt-1">
                    {shubh ? <Badge variant="success">Shubh</Badge> : <Badge variant="neutral">Ok</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            * Green dates are marked as auspicious (mock data).
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Choose time slot</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {timeSlots.map((t) => {
              const active = t.id === slot;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSlot(t.id)}
                  className={
                    "rounded-2xl p-3 text-left ring-1 transition " +
                    (active
                      ? "bg-[#FF9933]/12 ring-[#FF9933]/35"
                      : "bg-white ring-slate-200 hover:bg-slate-50")
                  }
                >
                  <div className="text-sm font-semibold">{t.label}</div>
                  <div className="mt-1 text-xs text-slate-500 leading-snug">{t.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Location</h2>
          <Card className="mt-3 overflow-hidden">
            <div className="p-4">
              <label className="text-xs font-semibold text-slate-600">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2.5 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-[#FF9933]/45"
              />
            </div>
            <div className="h-64 relative">
              <MapContainer 
                center={position} 
                zoom={15} 
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker 
                  position={position} 
                  setPosition={setPosition}
                  onLocationChange={setAddress}
                />
                <MapUpdater center={position} />
              </MapContainer>
              <div className="absolute top-3 right-3 z-[1000]">
                <Badge variant="neutral">Leaflet Map</Badge>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] w-full px-8">
                <div className="rounded-xl bg-white/90 backdrop-blur ring-1 ring-slate-200 px-4 py-2 text-center shadow-lg">
                  <div className="text-[11px] font-semibold text-slate-700 leading-tight">Tap on map to pin your location</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileShell>
  );
}
