import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { Button } from "@/components/ui/Button";
import { setLocation } from "@/store/slices/locationSlice";
import { LocationPicker } from "@/components/ui/LocationPicker";
import { shubhDaysISO } from "@/data/mock";
import { cn } from "@/lib/utils";
import { fetchTimeSlots, Slot } from "@/lib/api";

function toISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


export function Booking({
  serviceId,
  tierId,
  onBack,
  onConfirm,
}: {
  serviceId: string;
  tierId: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const today = new Date();
  const dispatch = useDispatch<AppDispatch>();
  const locationData = useSelector((state: RootState) => state.location.data);
  const [timeSlots, setTimeSlots] = React.useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(locationData?.selectedDate || toISO(today));
  const [slot, setSlot] = React.useState<string>(
    locationData?.slot || "08-12"
  );
  const [address, setAddress] = React.useState(locationData?.address || "Plot 12, Lakshmi Nagar, Hyderabad");
  const [locationType, setLocationType] = React.useState(locationData?.locationType || "Home");
  const [isLocationExpanded, setIsLocationExpanded] = React.useState(false);
  const [position, setPosition] = React.useState<[number, number]>(
    locationData?.latitude && locationData?.longitude
      ? [locationData.latitude, locationData.longitude]
      : [17.4483, 78.3915]
  );

  React.useEffect(() => {
    const getSlots = async () => {
      const slots = await fetchTimeSlots();
      setTimeSlots(slots);
    };
    getSlots();
  }, []);

  const persistSelectedLocation = React.useCallback(() => {
    dispatch(
      setLocation({
        address,
        latitude: position[0],
        longitude: position[1],
        locationType,
        selectedDate,
        slot,
        city: locationData?.city,
        neighbourhood: locationData?.neighbourhood,
        ip: locationData?.ip,
      })
    );
  }, [dispatch, address, position, locationType, selectedDate, slot, locationData]);

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
            <div className="text-xs text-slate-500 truncate">Pick auspicious date, time & location</div>
          </div>
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
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {next7.map(({iso, d, shubh}) => {
              const active = iso === selectedDate;
              const day = d.toLocaleDateString(undefined, {weekday: "short"});
              const date = d.getDate();
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    setSelectedDate(iso);
                    // Immediately persist date change
                    dispatch(
                      setLocation({
                        address,
                        latitude: position[0],
                        longitude: position[1],
                        locationType,
                        selectedDate: iso,
                        slot,
                        city: locationData?.city,
                        neighbourhood: locationData?.neighbourhood,
                        ip: locationData?.ip,
                      })
                    );
                  }}
                  className={
                    "mt-1 min-w-[58px] flex flex-col items-center justify-between rounded-2xl py-2 px-1 transition " +
                    (active
                      ? "bg-[#FF9933]/12 ring-[#FF9933]/35 ring-1"
                      : "bg-white ring-1 ring-slate-100 text-slate-400 hover:bg-slate-50")
                  }
                >
                  <div className={cn("text-[11px] font-semibold", active ? "font-medium text-[#B35300]" : "text-slate-500")}>
                    {day}
                  </div>
                  <div className={cn("text-xl font-bold my-1", active ? "text-xl font-bold text-[#B35300]" : "text-slate-800")}>
                    {date}
                  </div>
                  <div className="h-1.5 w-1.5 flex items-center justify-center">
                    {(shubh) && (
                      <div className={"h-1.5 w-1.5 rounded-full transition-colors bg-emerald-500"} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="text-xs text-slate-500 font-medium">
              Green dots indicate highly auspicious days (Shubh Din).
            </div>
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
                onClick={() => {
                  setSlot(t.id);
                  // Immediately persist slot change
                  dispatch(
                    setLocation({
                      address,
                      latitude: position[0],
                      longitude: position[1],
                      locationType,
                      selectedDate,
                      slot: t.id,
                      city: locationData?.city,
                      neighbourhood: locationData?.neighbourhood,
                      ip: locationData?.ip,
                    })
                  );
                }}
                  className={
                    "rounded-2xl p-3 text-left ring-1 transition " +
                    (active
                      ? "bg-[#FF9933]/12 ring-[#FF9933]/35"
                      : "bg-white ring-slate-200 hover:bg-slate-50")
                  }
                >
                  <div className={cn("text-sm font-bold", active ? "text-[#B35300]" : "text-slate-800")}>{t.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500 font-medium">{t.sub}</div>
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
                    selectedDate,
                    slot,
                    city: locationData?.city,
                    neighbourhood: locationData?.neighbourhood,
                    ip: locationData?.ip,
                  })
                );
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Destination</h2>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["Home", "Temple", "Others"].map((l) => {
              const active = l === locationType;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLocationType(l);
                    // Immediately persist type change to Redux
                    dispatch(
                      setLocation({
                        address,
                        latitude: position[0],
                        longitude: position[1],
                        locationType: l,
                        selectedDate,
                        slot,
                        city: locationData?.city,
                        neighbourhood: locationData?.neighbourhood,
                        ip: locationData?.ip,
                      })
                    );
                  }}
                  className={
                    "rounded-full px-4 py-2 text-xs font-semibold ring-1 transition " +
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

      </div>
    </MobileShell>
  );
}
