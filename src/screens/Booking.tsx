import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { Button } from "@/components/ui/Button";
import { setLocation } from "@/store/slices/locationSlice";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { shubhDaysISO } from "@/data/mock";

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
  const dispatch = useDispatch<AppDispatch>();
  const locationData = useSelector((state: RootState) => state.location.data);
  const [selectedDate, setSelectedDate] = React.useState(toISO(today));
  const [slot, setSlot] = React.useState<string>(
    "morning"
  );
  const [address, setAddress] = React.useState(locationData?.address || "Plot 12, Lakshmi Nagar, Hyderabad");
  const [locationType, setLocationType] = React.useState(locationData?.locationType || "Home");
  const [isLocationExpanded, setIsLocationExpanded] = React.useState(false);
  const [position, setPosition] = React.useState<[number, number]>(
    locationData?.latitude && locationData?.longitude
      ? [locationData.latitude, locationData.longitude]
      : [17.4483, 78.3915]
  );

  const persistSelectedLocation = React.useCallback(() => {
    dispatch(
      setLocation({
        address,
        latitude: position[0],
        longitude: position[1],
        locationType,
        city: locationData?.city,
        neighbourhood: locationData?.neighbourhood,
        ip: locationData?.ip,
      })
    );
  }, [dispatch, address, position, locationType, locationData]);

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
            onClick={() => {
              // Ensure the latest committed address/position are persisted before navigating back
              persistSelectedLocation();
              onBack();
            }}
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
        (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">Next</div>
              <div className="text-sm font-semibold">Checkout & tracking</div>
            </div>
            <Button onClick={() => {
              // Persist before moving forward
              persistSelectedLocation();
              onConfirm();
            }}>Continue</Button>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Choose date</h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {next7.map(({iso, d, shubh}) => {
              const active = iso === selectedDate;
              const day = d.toLocaleDateString(undefined, {weekday: "short"});
              const date = d.getDate();
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={
                    "min-w-[84px] mt-1 rounded-2xl p-3 text-left ring-1 transition " +
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pooja Location</h2>
            <button
              type="button"
              onClick={() => setIsLocationExpanded(!isLocationExpanded)}
              className="text-xs font-semibold text-[#B35300] hover:underline"
            >
              {isLocationExpanded ? "Close" : "Change"}
            </button>
          </div>
          <div className="mt-3">
            <LocationPicker
              address={address}
              position={position}
              locationData={locationData}
              locationType={locationType}
              onLocationTypeChange={(type) => {
                setLocationType(type);
                // Immediately persist type change to Redux
                dispatch(
                  setLocation({
                    address,
                    latitude: position[0],
                    longitude: position[1],
                    locationType: type,
                    city: locationData?.city,
                    neighbourhood: locationData?.neighbourhood,
                    ip: locationData?.ip,
                  })
                );
              }}
              isExpanded={isLocationExpanded}
              onExpandedChange={setIsLocationExpanded}
              onLocationChange={(newAddress, newPos) => {
                setAddress(newAddress);
                setPosition(newPos);
                // Persist to Redux so it survives navigation/back/front
                dispatch(
                  setLocation({
                    address: newAddress,
                    latitude: newPos[0],
                    longitude: newPos[1],
                    locationType,
                    city: locationData?.city,
                    neighbourhood: locationData?.neighbourhood,
                    ip: locationData?.ip,
                  })
                );
              }}
            />
          </div>
        </div>


      </div>
    </MobileShell>
  );
}
