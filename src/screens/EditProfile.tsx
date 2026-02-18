import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { User, Mail, Phone, Camera, ChevronLeft } from "lucide-react";
import {Badge} from "@/components/ui/Badge";
import {Label} from "@/components/ui/Label";

export function EditProfile({
  user,
  onBack,
  onSave,
}: {
  user: { name: string; profile: string; email: string; phone?: string } | null;
  onBack: () => void;
  onSave: (updatedUser: { name: string; email: string; phone: string }) => void;
}) {
  const [formData, setFormData] = React.useState({
    name: user?.name || "Srinivas Rao",
    email: user?.email || "srinivas.rao@example.com",
    phone: user?.phone || "+91 98765 43210",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl p-2 hover:bg-slate-900/5 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-left">
            <div className="font-bold text-base text-slate-900">Edit Profile</div>
          </div>
          <Badge variant="success">Secure</Badge>
        </>
      }
    >
      <div className="space-y-8 py-4">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {user?.profile ? (
              <img 
                src={user.profile} 
                alt={formData.name}
                className="h-28 w-28 rounded-full shadow-xl ring-4 ring-white object-cover"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-orange-400 to-[#FF9933] flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-white">
                {formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            )}
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-[#FF9933]">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-3 text-xs font-bold text-[#B35300] uppercase tracking-widest">Change Photo</p>
        </div>

        {/* Form Fields */}
        <Card className="p-5 border-slate-100 shadow-xl shadow-slate-200/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </Label>
              <Input
                icon={<User className="h-4 w-4" />}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="rounded-xl bg-white border-slate-200 ring-1 ring-slate-200 shadow-sm focus:bg-white focus:ring-2 focus:ring-[#FF9933]/45"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </Label>
              <Input
                type="email"
                icon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="rounded-xl bg-white border-slate-200 ring-1 ring-slate-200 shadow-sm focus:bg-white focus:ring-2 focus:ring-[#FF9933]/45"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Phone Number
              </Label>
              <Input
                type="tel"
                icon={<Phone className="h-4 w-4" />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 00000 00000"
                className="rounded-xl mt-1 bg-white border-slate-200 ring-1 ring-slate-200 shadow-sm focus:bg-white focus:ring-2 focus:ring-[#FF9933]/45"
              />
            </div>
          </form>
        </Card>

        <div className="px-1">
          <p className="text-[11px] text-slate-400 leading-relaxed text-center">
            Your personal information is used to personalize your experience and for booking communications.
          </p>
        </div>

        <Button 
          className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-orange-200 mt-2"
          onClick={handleSubmit}
        >
          Update Profile
        </Button>
      </div>
    </MobileShell>
  );
}
