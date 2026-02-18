import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NotificationSettingsDialog } from "@/components/account/NotificationSettingsDialog";
import { Tab } from "@/types";
import packageJson from "../../package.json";
import { 
  User, 
  MapPin, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Settings,
  Languages,
  Info,
  Crown,
  Trash2
} from "lucide-react";

export function Account({
  onNavigate,
  onLogout,
  onEditProfile,
  user: userProp,
}: {
  onNavigate: (tab: Tab) => void;
  onLogout?: () => void;
  onEditProfile?: () => void;
  user?: { name: string; profile: string; email: string } | null;
}) {
  const user = {
    name: userProp?.name || "Srinivas Rao",
    email: userProp?.email || "srinivas.rao@example.com",
    profile: userProp?.profile,
    phone: "+91 98765 43210",
    memberSince: "Jan 2025",
    subscription: "Premium" as "Basic" | "Premium"
  };

  const [isNotificationsDialogOpen, setIsNotificationsDialogOpen] = React.useState(false);
  const [notificationSettings, setNotificationSettings] = React.useState({
    push: true,
    email: false,
    offers: true,
    reminders: true,
  });

  const menuGroups = [
    {
      title: "Profile Settings",
      items: [
        { icon: <User className="h-5 w-5 text-blue-500" />, label: "Personal Information", extra: "Edit profile", onClick: onEditProfile },
        { icon: <MapPin className="h-5 w-5 text-red-500" />, label: "Saved Addresses", extra: "3 addresses" },
        { 
          icon: <Bell className="h-5 w-5 text-orange-500" />, 
          label: "Notifications", 
          extra: notificationSettings.push ? "On" : "Off",
          onClick: () => setIsNotificationsDialogOpen(true)
        },
      ]
    },
    {
      title: "App Settings",
      items: [
        { icon: <Languages className="h-5 w-5 text-emerald-500" />, label: "Language", extra: "English (Telugu available)" },
        { icon: <ShieldCheck className="h-5 w-5 text-indigo-500" />, label: "Privacy & Security", extra: "" },
        { icon: <Trash2 className="h-5 w-5 text-red-500" />, label: "Delete My Account", extra: "Permanent action" },
      ]
    },
    {
      title: "Support & About",
      items: [
        { icon: <HelpCircle className="h-5 w-5 text-purple-500" />, label: "Help & Support", extra: "" },
        { icon: <Info className="h-5 w-5 text-slate-500" />, label: "About Yajro", extra: `v${packageJson.version}` },
      ]
    }
  ];

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="rounded-xl p-2 hover:bg-slate-900/5 transition-colors"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1 text-left">
            <div className="truncate font-bold text-base text-slate-900">My Account</div>
          </div>
          <Badge variant={user.subscription === "Premium" ? "gold" : "saffron"} className="px-2 py-0.5 uppercase tracking-wider text-[9px] font-bold">
            {user.subscription === "Premium" && <Crown className="h-2.5 w-2.5 mr-1 inline-block" />}
            {user.subscription}
          </Badge>
        </>
      }
      bottomNav={<BottomNav activeTab="account" onTabChange={onNavigate} />}
    >
      <div className="space-y-6 pb-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            {user.profile ? (
              <img 
                src={user.profile} 
                alt={user.name}
                className="h-24 w-24 rounded-full shadow-lg ring-4 ring-white object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-[#FF9933] flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
            <button 
              onClick={onEditProfile}
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-600" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500 font-medium">{user.phone}</p>
          <div className="mt-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
            <span className="text-[11px] font-bold text-[#B35300] uppercase tracking-wider">Member since {user.memberSince}</span>
          </div>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{group.title}</h3>
            <Card className="overflow-hidden border-slate-100 shadow-sm p-0">
              <div className="divide-y divide-slate-50">
                {group.items.map((item: any, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    onClick={item.onClick}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{item.label}</span>
                        {item.extra && <span className="text-[11px] text-slate-400 font-medium">{item.extra}</span>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full h-12 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold gap-2 rounded-2xl"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout from Yajro
          </Button>
          <p className="mt-6 text-center text-[10px] text-slate-400 font-medium">
            Made with ❤️ for spiritual wellness<br/>
            © 2026 Yajro Technologies Pvt Ltd.
          </p>
        </div>
      </div>
      <NotificationSettingsDialog 
        open={isNotificationsDialogOpen}
        onOpenChange={setIsNotificationsDialogOpen}
        settings={notificationSettings}
        onSettingsChange={setNotificationSettings}
      />
    </MobileShell>
  );
}
