import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

interface NotificationSettings {
  push: boolean;
  email: boolean;
  offers: boolean;
  reminders: boolean;
}

interface NotificationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

export function NotificationSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: NotificationSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[90%] w-[350px] p-0 overflow-hidden border-none shadow-2xl"
      >
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#FF9933]" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-slate-900">Push Notifications</Label>
              <p className="text-xs text-slate-500">Receive alerts on your device</p>
            </div>
            <Switch 
              checked={settings.push}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, push: checked })}
            />
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700">Service Updates</Label>
                <p className="text-[11px] text-slate-500">Track your pooja progress</p>
              </div>
              <Switch 
                checked={settings.reminders}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, reminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700">Offers & Promotions</Label>
                <p className="text-[11px] text-slate-500">New discounts and spiritual gifts</p>
              </div>
              <Switch 
                checked={settings.offers}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, offers: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700">Email Notifications</Label>
                <p className="text-[11px] text-slate-500">Weekly spiritual insights</p>
              </div>
              <Switch 
                checked={settings.email}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, email: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-white border-t mb-1 mr-1 border-slate-100 flex-row justify-end">
          <Button
            className="rounded-lg h-8 px-6"
            onClick={() => onOpenChange(false)}
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
