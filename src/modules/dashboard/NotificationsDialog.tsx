import * as React from "react";
import { Bell, Calendar, CheckCircle2, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "booking" | "payment" | "system";
  unread: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Booking Request",
    message: "You have a new Satyanarayana Pooja request from Raghavendra Rao.",
    time: "2 mins ago",
    type: "booking",
    unread: true,
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Payment for Griha Pravesh (Sowmya N) has been processed.",
    time: "1 hour ago",
    type: "payment",
    unread: true,
  },
  {
    id: "3",
    title: "Profile Verified",
    message: "Your profile has been successfully verified. You can now accept more bookings.",
    time: "Yesterday",
    type: "system",
    unread: false,
  },
];

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-xl border transition-colors ${
                notification.unread ? "bg-orange-50/50 border-orange-100" : "bg-white border-slate-100"
              }`}
            >
              <div className="flex gap-3">
                <div className={`mt-0.5 p-2 rounded-full ${
                  notification.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                  notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {notification.type === 'booking' && <Calendar className="h-4 w-4" />}
                  {notification.type === 'payment' && <CheckCircle2 className="h-4 w-4" />}
                  {notification.type === 'system' && <Info className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button 
            className="text-xs font-bold text-orange-600 hover:text-orange-700 transition"
            onClick={() => onOpenChange(false)}
          >
            Mark all as read
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
