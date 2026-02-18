import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your Satyanarayana Vratam is confirmed for tomorrow.",
    time: "2h ago",
    type: "success",
  },
  {
    id: 2,
    title: "Offer Ending Soon",
    message: "Your 10% discount on first pooja expires in 24 hours!",
    time: "1d ago",
    type: "warning",
  },
  {
    id: 3,
    title: "New Muhurtham Alert",
    message: "Tomorrow's Abhijit Muhurtham starts at 11:45 AM.",
    time: "5h ago",
    type: "info",
  },
  {
    id: 4,
    title: "Offer Ending Soon",
    message: "Your 10% discount on first pooja expires in 24 hours!",
    time: "1d ago",
    type: "warning",
  },
  {
    id: 5,
    title: "Booking Confirmed",
    message: "Your Satyanarayana Vratam is confirmed for tomorrow.",
    time: "2h ago",
    type: "success",
  },{
    id: 3,
    title: "New Muhurtham Alert",
    message: "Tomorrow's Abhijit Muhurtham starts at 11:45 AM.",
    time: "5h ago",
    type: "info",
  },
  {
    id: 4,
    title: "Offer Ending Soon",
    message: "Your 10% discount on first pooja expires in 24 hours!",
    time: "1d ago",
    type: "warning",
  },
  {
    id: 5,
    title: "Booking Confirmed",
    message: "Your Satyanarayana Vratam is confirmed for tomorrow.",
    time: "2h ago",
    type: "success",
  },
];

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsDialog({
  open,
  onOpenChange,
}: NotificationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[90%] w-[380px] p-0 overflow-hidden border-none shadow-2xl gap-2"
      >
        <DialogHeader className="px-5 py-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-semibold text-[#d86705e0] flex items-center gap-2">
            Notifications
            {notifications.length > 0 && (
              <Badge variant="saffron" className="h-4 px-1.5 text-[10px]">{notifications.length}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] h-[45vh] overflow-y-auto px-2">
          <div className="space-y-2">
            {notifications.map((n) => (
              <React.Fragment key={n.id}>
                <div 
                  className={cn(
                    "shadow-sm flex gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer group rounded-xl mx-2",
                    n.type === 'success' ? "bg-emerald-50/30" :
                    n.type === 'warning' ? "bg-orange-50/30" :
                    "bg-blue-50/30"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    n.type === 'success' ? "bg-white text-emerald-600" :
                    n.type === 'warning' ? "bg-white text-[#FF9933]" :
                    "bg-white text-blue-600"
                  )}>
                    {n.type === 'success' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : n.type === 'warning' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8 4 4-4 4"/><path d="M8 12h7"/><circle cx="12" cy="12" r="10"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="10"/></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-sm font-bold text-slate-900 truncate group-hover:text-[#B35300] transition-colors">{n.title}</span>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                  </div>
                </div>

              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <Button 
            variant="ghost"
            size="xs"
            className="w-full p-0 text-xs font-bold text-slate-500 hover:text-slate-900"
            onClick={() => onOpenChange(false)}
          >
            Mark all as read
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
