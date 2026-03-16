import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Package, X, ShoppingBasket } from "lucide-react";
import type { PartnerService } from "@/data/partner-mock";
import { handleTagKeyDown } from "@/lib/utils";

interface Step3Props {
  formData: Omit<PartnerService, "id">;
  updateField: (field: keyof Omit<PartnerService, "id">, value: any) => void;
}

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="space-y-1">
    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
      {label}
    </p>
    <p className="text-[11px] text-slate-900 font-bold truncate">
      {value}
    </p>
  </div>
);

export const Step3Finalize: React.FC<Step3Props> = ({
  formData,
  updateField,
}) => {
  const [tagInput, setTagInput] = React.useState("");

  const items = [
    { label: "Service Name", value: formData.name || "Untitled" },
    { label: "Type", value: formData.visitType },
    { label: "Duration", value: formData.duration },
    { label: "Items", value: `${formData.requiredItems?.length || 0} items` },
  ];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.requiredItems.includes(trimmed)) {
      updateField("requiredItems", [...formData.requiredItems, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField("requiredItems", formData.requiredItems.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3 mb-2">
        <Label className="text-slate-600 ml-1">Pooja Essential Items</Label>
        
        <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
          {formData.requiredItems.map((item) => (
            <div 
              key={item} 
              className="bg-[#FF9933]/10 text-[#B35300] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#FF9933]/20 animate-in zoom-in-50 duration-200"
            >
              {item}
              <button 
                type="button" 
                onClick={() => removeTag(item)}
                className="hover:bg-[#FF9933]/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {formData.requiredItems.length === 0 && (
            <p className="text-[10px] text-slate-400 italic py-1">No items added yet</p>
          )}
        </div>

        <div className="relative mb-2">
          <Input
            icon={<ShoppingBasket className="w-4 h-4 text-slate-400" />}
            placeholder="E.g. Flowers, Milk"
            value={tagInput} 
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => handleTagKeyDown(e, tagInput, addTag)}
            className="h-10 text-sm tabular-nums bg-white border-slate-200 focus:border-[#FF9933] transition-all rounded-xl shadow-sm"
          />
        </div>
        <p className="text-[10px] text-slate-400 ml-1">Separate items with commas or space</p>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-slate-900">Activate Opted Service</p>
            <p className="text-[11px] text-slate-500">Make this opted service visible to customers</p>
          </div>
          <Switch 
            checked={formData.enabled} 
            onCheckedChange={(val) => updateField("enabled", val)} 
          />
        </div>
      </div>

      <div className="pt-2 p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-[#B35300]">
          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
            <Package className="w-3 h-3" />
          </div>
          <p className="text-xs font-bold">Opted Service Summary</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <InfoItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
        
      </div>
    </div>
  );
};
