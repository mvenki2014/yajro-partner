import * as React from "react";
import { HiOutlineMapPin } from "react-icons/hi2";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationsDialog } from "@/components/home/NotificationsDialog";
import { earningsSummary, partnerBookings, priestProfile } from "@/data/partner-mock";
import { TodaySummary } from "@/components/dashboard/TodaySummary";
import { NextPoojaCard } from "@/components/dashboard/NextPoojaCard";
import { PendingRequests } from "@/components/dashboard/PendingRequests";
import { EarningsCard, EarningsTab } from "@/components/dashboard/EarningsCard";
import { StatusToggle } from "@/components/dashboard/StatusToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

export function PartnerDashboard({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [isOnline, setIsOnline] = React.useState(true);
  const [hasUnread, setHasUnread] = React.useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [earningsTab, setEarningsTab] = React.useState<EarningsTab>("total");

  const locationText = priestProfile.serviceAreas[0]?.replace(/\s\d{6}$/, "") || "Hyderabad";

  const pendingRequests = partnerBookings.filter((booking) => booking.status === "Pending");
  const nextBooking = partnerBookings[0];

  const earningsValue =
    earningsTab === "total"
      ? earningsSummary.total
      : earningsTab === "weekly"
        ? earningsSummary.weekly
        : earningsSummary.monthly;

  useSetShell({
    title: (
      <>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#B35300] truncate tracking-tight">Namaste, Vishwanath ji</div>
          <div className="mt-0.5 flex items-center gap-1 text-slate-500">
            <HiOutlineMapPin className="h-3 w-3 text-orange-400" />
            <span className="text-[10px] font-medium truncate uppercase tracking-wider">{locationText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusToggle
            isOnline={isOnline}
            onToggle={() => setIsOnline((prev) => !prev)}
          />

          <NotificationBell
            hasUnread={hasUnread}
            onClick={() => {
              setHasUnread(false);
              setIsNotificationsOpen(true);
            }}
          />
        </div>
      </>
    ),
    bottomNav: <BottomNav activeTab="dashboard" onTabChange={onNavigate} />,
  });

  return (
    <>
      <div className="space-y-5 pb-18">
        <EarningsCard
          currentTab={earningsTab}
          onTabChange={setEarningsTab}
          earningsValue={earningsValue}
        />
        <TodaySummary />

        {nextBooking && (
          <NextPoojaCard
            poojaName={nextBooking.serviceType}
            time={nextBooking.dateTime}
            customerName={nextBooking.customerName}
            address={nextBooking.address}
          />
        )}

        <PendingRequests
          requests={pendingRequests.map(b => ({
            id: b.id,
            serviceName: b.serviceType,
            dateTime: b.dateTime,
            location: b.address,
            price: b.amount
          }))}
          onViewAll={() => onNavigate("orders")}
        />

      </div>

      <NotificationsDialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </>
  );
}
