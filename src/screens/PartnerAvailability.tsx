import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { fetchTimeSlots, Slot } from "@/lib/api";

const STORAGE_KEY = "partner-availability-config";

type AvailabilityConfig = {
  instantBooking: boolean;
  blockedDates: string[];
  unavailableSlotsByDate: Record<string, string[]>;
};

function toISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatShortOrdinalDate(iso: string) {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;

  const day = parsed.getDate();
  const month = parsed.toLocaleDateString(undefined, { month: "short" });

  const mod10 = day % 10;
  const mod100 = day % 100;
  const suffix =
    mod10 === 1 && mod100 !== 11
      ? "st"
      : mod10 === 2 && mod100 !== 12
        ? "nd"
        : mod10 === 3 && mod100 !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month}`;
}

function loadStoredConfig(): Partial<AvailabilityConfig & { dateSlots?: Record<string, string[]> }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function PartnerAvailability({ onBack }: { onBack: () => void }) {
  const today = new Date();
  const todayISO = toISO(today);
  const stored = React.useMemo(() => loadStoredConfig(), []);

  const next10 = React.useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        iso: toISO(d),
        d,
      };
    });
  }, [today]);

  const [timeSlots, setTimeSlots] = React.useState<Slot[]>([]);
  React.useEffect(() => {
    fetchTimeSlots().then(setTimeSlots);
  }, []);

  const [selectedDate, setSelectedDate] = React.useState(todayISO);
  const [blockedDates, setBlockedDates] = React.useState<string[]>(() => {
    const saved = stored.blockedDates || [];
    return saved.length > 0 ? saved : [todayISO];
  });
  const [unavailableSlotsByDate, setUnavailableSlotsByDate] = React.useState<Record<string, string[]>>(
    stored.unavailableSlotsByDate || stored.dateSlots || {}
  );
  const [instantBooking, setInstantBooking] = React.useState(stored.instantBooking ?? true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const isFullDayUnavailable = blockedDates.includes(selectedDate);
  const selectedDateUnavailableSlots = isFullDayUnavailable
    ? []
    : unavailableSlotsByDate[selectedDate] ?? [];
  const partialLeaveDates = Object.keys(unavailableSlotsByDate).filter(
    (date) => !blockedDates.includes(date) && (unavailableSlotsByDate[date] || []).length > 0
  );
  const fullLeaveCount = blockedDates.length;
  const partialLeaveCount = partialLeaveDates.length;
  const leaveDates = React.useMemo(() => {
    const merged = new Map<string, "full" | "partial">();

    blockedDates.forEach((date) => merged.set(date, "full"));
    partialLeaveDates.forEach((date) => {
      if (!merged.has(date)) merged.set(date, "partial");
    });

    return Array.from(merged.entries()).sort(
      ([a], [b]) => new Date(`${a}T00:00:00`).getTime() - new Date(`${b}T00:00:00`).getTime()
    );
  }, [blockedDates, partialLeaveDates]);

  const onDateClick = (iso: string) => {
    setMessage("");
    setSelectedDate(iso);

    const isAlreadyLeave = blockedDates.includes(iso);

    if (isAlreadyLeave) {
      // Clicking an already-leave date removes leave (full-day off for that date).
      setBlockedDates((prev) => prev.filter((date) => date !== iso));

      // When full-day is removed, default to all slots available.
      setUnavailableSlotsByDate((prev) => {
        const next = { ...prev };
        delete next[iso];
        return next;
      });
      return;
    }

    // Clicking a non-leave date marks full-day leave for that date.
    setBlockedDates((prev) => [...prev, iso]);
    setUnavailableSlotsByDate((prev) => {
      const next = { ...prev };
      delete next[iso];
      return next;
    });
  };

  const onToggleFullDay = (checked: boolean) => {
    setMessage("");

    if (checked) {
      setBlockedDates((prev) => (prev.includes(selectedDate) ? prev : [...prev, selectedDate]));
      setUnavailableSlotsByDate((prev) => {
        const next = { ...prev };
        delete next[selectedDate];
        return next;
      });
      return;
    }

    setBlockedDates((prev) => prev.filter((date) => date !== selectedDate));
    // If user disables full-day, default to all slots available.
    setUnavailableSlotsByDate((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
  };

  const onToggleSlotUnavailable = (slotId: string) => {
    if (isFullDayUnavailable) return;

    setUnavailableSlotsByDate((prev) => {
      const current = prev[selectedDate] ?? [];
      const updated = current.includes(slotId)
        ? current.filter((item) => item !== slotId)
        : Array.from(new Set([...current, slotId]));

      return {
        ...prev,
        [selectedDate]: updated,
      };
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setMessage("");

    const payload: AvailabilityConfig = {
      instantBooking,
      blockedDates,
      unavailableSlotsByDate,
    };

    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setIsSaving(false);
      setMessage("Availability updated successfully.");
    }, 500);
  };

  useSetShell({
    title: (
      <>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl p-2 hover:bg-slate-900/5 transition-colors"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 text-left">
          <div className="truncate font-semibold">Manage Availability</div>
          <div className="text-xs text-slate-500 truncate">Select date and set slot-level unavailability</div>
        </div>
      </>
    ),
    footer: (
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">Availability Summary</div>
          <div className="text-sm font-semibold">
            {fullLeaveCount > 0
              ? `${fullLeaveCount} day(s) full leave`
              : partialLeaveCount > 0
                ? `${partialLeaveCount} day(s) partial available`
                : "No leave marked"}
          </div>
        </div>
        <Button className="h-12 px-6 rounded-2xl shadow-lg shadow-orange-200" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    ),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Instant Booking</p>
          <p className="text-xs text-slate-500">Allow customers to book instantly</p>
        </div>
        <Switch checked={instantBooking} onCheckedChange={setInstantBooking} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <div className="text-xs text-slate-500">10 days</div>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {next10.map(({ iso, d }) => {
            const active = selectedDate === iso;
            const blocked = blockedDates.includes(iso);
            const partial = partialLeaveDates.includes(iso);
            const day = d.toLocaleDateString(undefined, { weekday: "short" });
            const date = d.getDate();
            const month = d.toLocaleDateString(undefined, { month: "short" });

            return (
              <button
                key={iso}
                type="button"
                onClick={() => onDateClick(iso)}
                className={
                  "rounded-2xl p-3 text-left ring-1 transition " +
                  (blocked
                    ? "bg-red-50 ring-red-200"
                    : partial
                      ? "bg-orange-50 ring-orange-200"
                    : active
                      ? "bg-[#FF9933]/12 ring-[#FF9933]/35"
                      : "bg-white ring-slate-200 hover:bg-slate-50")
                }
              >
                <div className={cn("text-xs font-semibold", blocked ? "text-red-600" : partial ? "text-[#B35300]" : active ? "text-[#B35300]" : "text-slate-500")}>{day}</div>
                <div className={cn("mt-0.5 text-2xl font-bold", blocked ? "text-red-700" : partial ? "text-[#B35300]" : active ? "text-[#B35300]" : "text-slate-900")}>{date}</div>
                <div className={cn("text-[11px] font-medium", blocked ? "text-red-500" : partial ? "text-[#B35300]" : "text-slate-500")}>{month}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Unavailable Slots</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Full Day</span>
            <Switch checked={isFullDayUnavailable} onCheckedChange={onToggleFullDay} />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => {
            const unavailableBySlot = selectedDateUnavailableSlots.includes(slot.id);
            const showUnavailableText = isFullDayUnavailable || unavailableBySlot;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={isFullDayUnavailable}
                onClick={() => onToggleSlotUnavailable(slot.id)}
                className={
                  "rounded-2xl p-3 text-left ring-1 transition " +
                  (isFullDayUnavailable
                    ? "bg-slate-100 ring-slate-200 text-slate-400"
                    : unavailableBySlot
                      ? "bg-red-50 ring-red-300"
                      : "bg-white ring-slate-200 hover:bg-slate-50")
                }
              >
                <div className={cn("text-sm font-bold", unavailableBySlot ? "text-red-700" : "text-slate-800")}>{slot.label}</div>
                <div className="mt-1 text-[11px] text-slate-500 font-medium">{slot.sub}</div>
                <div className={cn("mt-1 text-[10px] font-semibold", isFullDayUnavailable ? "text-slate-500" : unavailableBySlot ? "text-red-600" : "text-slate-500")}>
                  {showUnavailableText ? "Unavailable" : "Available"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {leaveDates.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Leave Dates</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {leaveDates.map(([date, type]) =>
              type === "full" ? (
                <Badge key={date} variant="destructive">{formatShortOrdinalDate(date)}</Badge>
              ) : (
                <Badge key={date} className="bg-orange-100 text-[#B35300] ring-1 ring-orange-200">
                  {formatShortOrdinalDate(date)}
                </Badge>
              )
            )}
          </div>
        </div>
      )}

      {message && <p className="text-xs font-semibold text-emerald-600">{message}</p>}
    </div>
  );
}
