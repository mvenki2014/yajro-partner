import * as React from "react";
import { HiOutlineBell } from "react-icons/hi2";

interface NotificationBellProps {
  hasUnread: boolean;
  onClick: () => void;
}

export function NotificationBell({ hasUnread, onClick }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-full p-2 hover:bg-slate-100 transition"
      aria-label="Notifications"
    >
      <HiOutlineBell className="h-5 w-5 text-slate-700" />
      {hasUnread && (
        <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
      )}
    </button>
  );
}
