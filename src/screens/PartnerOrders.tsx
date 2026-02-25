import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { partnerBookings, type PartnerBooking, type PartnerBookingStatus } from "@/data/partner-mock";

const statusOrder: PartnerBookingStatus[] = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"];

export function PartnerOrders({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [orders, setOrders] = React.useState(partnerBookings);
  const [rejectReasonById, setRejectReasonById] = React.useState<Record<string, string>>({});

  useSetShell({
    title: <PageHeader title="Orders" onBack={() => onNavigate("dashboard")} />,
    bottomNav: <BottomNav activeTab="orders" onTabChange={onNavigate} />,
  });

  const updateStatus = (id: string, status: PartnerBookingStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  };

  return (
    <div className="space-y-3 pb-20">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={updateStatus}
          rejectReason={rejectReasonById[order.id] || ""}
          onRejectReasonChange={(value) => setRejectReasonById((prev) => ({ ...prev, [order.id]: value }))}
        />
      ))}
    </div>
  );
}

function OrderCard({
  order,
  onUpdateStatus,
  rejectReason,
  onRejectReasonChange,
}: {
  order: PartnerBooking;
  onUpdateStatus: (id: string, status: PartnerBookingStatus) => void;
  rejectReason: string;
  onRejectReasonChange: (value: string) => void;
}) {
  const canReject = order.status === "Pending";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">{order.serviceType}</h3>
          <p className="text-xs text-slate-500">{order.id} • {order.dateTime}</p>
        </div>
        <Badge variant={order.status === "Pending" ? "gold" : order.status === "Completed" ? "success" : "neutral"}>
          {order.status}
        </Badge>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 space-y-1">
        <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
        <p><span className="font-semibold">Address:</span> {order.address}</p>
        <p><span className="font-semibold">Amount:</span> INR {order.amount}</p>
        <p><span className="font-semibold">Notes:</span> {order.notes}</p>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {statusOrder.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={order.status === status ? "default" : "secondary"}
            onClick={() => onUpdateStatus(order.id, status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {canReject && (
        <div className="mt-3 space-y-2">
          <Input placeholder="Rejection reason" value={rejectReason} onChange={(e) => onRejectReasonChange(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onUpdateStatus(order.id, "Accepted")}>Accept</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!rejectReason.trim()) return;
                onUpdateStatus(order.id, "Cancelled");
              }}
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline">Call Customer</Button>
        <Button variant="secondary">Chat (Optional)</Button>
      </div>
    </Card>
  );
}
