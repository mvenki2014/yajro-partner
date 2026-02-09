import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Map, MapMarker, MapControls, MarkerContent } from "@/components/ui/Map";
import { shubhDaysISO } from "@/data/mock";
import {reverseGeocode} from "@/lib/location";
import { MapPin } from "lucide-react";

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
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="h-64 relative">
              <Map
                center={[position[1], position[0]]}
                zoom={15}
                onClick={(e) => {
                  const newPos: [number, number] = [e.lngLat.lat, e.lngLat.lng];
                  setPosition(newPos);
                  reverseGeocode(newPos[0], newPos[1]).then((data) => {
                    if (data) {
                      console.log('Address data:', data);
                      setAddress(data.address);
                    }
                  });
                }}
              >
                <MapControls position="top-right" showZoom showLocate />

                {/* Current Location Marker (Blue Ball) */}
                {locationData?.latitude && locationData?.longitude && (
                  <MapMarker
                    longitude={locationData.longitude}
                    latitude={locationData.latitude}
                  >
                    <MarkerContent>
                      <div className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-sm"></span>
                      </div>
                    </MarkerContent>
                  </MapMarker>
                )}

                <MapMarker
                  draggable
                  longitude={position[1]}
                  latitude={position[0]}
                  onDragEnd={(lngLat) => {
                    const newPos: [number, number] = [lngLat.lat, lngLat.lng];
                    setPosition(newPos);
                    reverseGeocode(newPos[0], newPos[1]).then((data) => {
                      if (data) setAddress(data.address);
                    });
                  }}
                >
                  <MarkerContent>
                    <div className="cursor-move">
                      <MapPin
                        className="fill-[#FF9933] stroke-white"
                        size={28}
                      />
                    </div>
                  </MarkerContent>
                </MapMarker>
              </Map>
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="neutral">Map CN</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileShell>
  );
}
