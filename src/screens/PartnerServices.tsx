import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { partnerServices, type PartnerService } from "@/data/partner-mock";

const emptyService: Omit<PartnerService, "id"> = {
  name: "",
  category: "Pooja",
  description: "",
  duration: "",
  basePrice: 0,
  customPrice: false,
  visitType: "Home Visit",
  requiredItems: [],
  enabled: true,
};

export function PartnerServices({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [services, setServices] = React.useState(partnerServices);
  const [draft, setDraft] = React.useState(emptyService);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [requiredItemsText, setRequiredItemsText] = React.useState("");

  useSetShell({
    title: <PageHeader title="Services" onBack={() => onNavigate("dashboard")} />,
    bottomNav: <BottomNav activeTab="services" onTabChange={onNavigate} />,
  });

  const handleSave = () => {
    if (!draft.name.trim() || !draft.description.trim() || draft.basePrice <= 0 || !draft.duration.trim()) {
      return;
    }

    const payload: Omit<PartnerService, "id"> = {
      ...draft,
      requiredItems: requiredItemsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (editingId) {
      setServices((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item)));
    } else {
      setServices((prev) => [{ id: `svc-${Date.now()}`, ...payload }, ...prev]);
    }

    setDraft(emptyService);
    setRequiredItemsText("");
    setEditingId(null);
  };

  const startEdit = (service: PartnerService) => {
    setEditingId(service.id);
    setDraft({ ...service });
    setRequiredItemsText(service.requiredItems.join(", "));
  };

  return (
    <div className="space-y-4 pb-20">
      <Card className="p-4">
        <h2 className="text-sm font-bold text-slate-900">{editingId ? "Edit Service" : "Add New Service"}</h2>
        <div className="mt-3 space-y-2">
          <Input placeholder="Service Name" value={draft.name} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
          <Input placeholder="Category (Pooja/Homam/Ceremony)" value={draft.category} onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))} />
          <Input placeholder="Description" value={draft.description} onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Duration (e.g. 2h 30m)" value={draft.duration} onChange={(e) => setDraft((prev) => ({ ...prev, duration: e.target.value }))} />
            <Input
              placeholder="Base Price"
              type="number"
              value={draft.basePrice ? String(draft.basePrice) : ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, basePrice: Number(e.target.value) || 0 }))}
            />
          </div>
          <Input placeholder="Visit Type (Home Visit / Temple Visit / Both)" value={draft.visitType} onChange={(e) => setDraft((prev) => ({ ...prev, visitType: e.target.value as PartnerService["visitType"] }))} />
          <Input placeholder="Required Items (comma separated)" value={requiredItemsText} onChange={(e) => setRequiredItemsText(e.target.value)} />
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-sm text-slate-700">Custom Price Option</p>
            <Switch checked={draft.customPrice} onCheckedChange={(value) => setDraft((prev) => ({ ...prev, customPrice: value }))} />
          </div>
          <Button className="w-full" onClick={handleSave}>{editingId ? "Update Service" : "Add Service"}</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                <p className="text-xs text-slate-500">{service.category} • {service.duration} • INR {service.basePrice}</p>
              </div>
              <Switch
                checked={service.enabled}
                onCheckedChange={(value) => setServices((prev) => prev.map((item) => (item.id === service.id ? { ...item, enabled: value } : item)))}
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="neutral">{service.visitType}</Badge>
              {service.customPrice && <Badge variant="gold">Custom Price</Badge>}
              {service.requiredItems.slice(0, 2).map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => startEdit(service)}>Edit</Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setServices((prev) => prev.filter((item) => item.id !== service.id))}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
