import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ChevronRight,
  CalendarClock,
  User,
  Languages,
  MapPin,
  FileCheck,
  Landmark,
  Star,
  Bell,
  ShieldCheck,
  HelpCircle,
  Info,
  LogOut,
} from "lucide-react";
import packageJson from "../../package.json";
import { priestProfile } from "@/data/partner-mock";

export function PartnerProfile({ onNavigate, onLogout }: { onNavigate: (tab: any) => void; onLogout: () => void }) {
  const initials = priestProfile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const menuGroups = [
    {
      title: "Profile Settings",
      items: [
        {
          icon: <CalendarClock className="h-5 w-5 text-orange-500" />,
          label: "Manage Availability",
          extra: "Set leave & time slots",
          onClick: () => onNavigate("availability"),
        },
        {
          icon: <User className="h-5 w-5 text-blue-500" />,
          label: "Personal Information",
          extra: "Edit profile",
        },
        {
          icon: <Languages className="h-5 w-5 text-emerald-500" />,
          label: "Languages",
          extra: priestProfile.languages.join(", "),
        },
        {
          icon: <MapPin className="h-5 w-5 text-red-500" />,
          label: "Service Areas",
          extra: `${priestProfile.serviceAreas.length} locations`,
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          icon: <FileCheck className="h-5 w-5 text-indigo-500" />,
          label: "Certificates",
          extra: "Upload and manage",
        },
        {
          icon: <Landmark className="h-5 w-5 text-amber-600" />,
          label: "Bank Details",
          extra: "Payout account",
        },
        {
          icon: <Star className="h-5 w-5 text-yellow-500" />,
          label: "Ratings & Reviews",
          extra: `${priestProfile.rating} rating (${priestProfile.totalReviews} reviews)`,
        },
        {
          icon: <Bell className="h-5 w-5 text-orange-500" />,
          label: "Notifications",
          extra: "On",
        },
      ],
    },
    {
      title: "Support & About",
      items: [
        {
          icon: <ShieldCheck className="h-5 w-5 text-violet-500" />,
          label: "Privacy & Security",
          extra: "Manage account security",
        },
        {
          icon: <HelpCircle className="h-5 w-5 text-purple-500" />,
          label: "Help & Support",
          extra: "Contact Yajro team",
        },
        {
          icon: <Info className="h-5 w-5 text-slate-500" />,
          label: "About Yajro Priests",
          extra: `v${packageJson.version}`,
        },
      ],
    },
  ];

  useSetShell({
    title: <PageHeader title="My Account" onBack={() => onNavigate("dashboard")} />,
    bottomNav: <BottomNav activeTab="profile" onTabChange={onNavigate} />,
  });

  return (
    <div className="space-y-6 pb-20 pt-2">
      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-[#FF9933] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-bold text-[#7A3512] text-center">{priestProfile.fullName}</h1>
        <p className="text-[#A45A31] text-text-secondary text-sm font-medium">Priest since {new Date().getFullYear() - priestProfile.experienceYears}</p>

        <div className="mt-3 flex items-center gap-2">
          <Badge variant="gold" className="px-4 py-1 text-xs">
            ★ {priestProfile.rating} Rating
          </Badge>
          <Badge variant="saffron" className="px-4 py-1 text-xs">
            {priestProfile.experienceYears} Years Exp
          </Badge>
        </div>
      </div>

      {menuGroups.map((group) => (
        <div key={group.title} className="space-y-2">
          <h2 className="px-1 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">{group.title}</h2>
          <Card className="overflow-hidden p-0 border-slate-100 shadow-sm">
            <div className="divide-y divide-slate-100">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={item.onClick}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-50 shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.label}</p>
                      <p className="text-xs text-slate-500 truncate">{item.extra}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full h-12 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-2xl"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        Logout from Yajro Priests
      </Button>
    </div>
  );
}
