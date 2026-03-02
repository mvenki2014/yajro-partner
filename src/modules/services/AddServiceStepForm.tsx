import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { ChevronRight, ChevronLeft, Check, IndianRupee, Info, Settings2, Package, ChevronDown, X, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";
import { step1Schema, step2Schema, step3Schema } from "@/zod/serviceSchema";
import { z } from "zod";

const steps = [
  { id: 1, title: "Basic Info", icon: Info },
  { id: 2, title: "Packages", icon: Package },
  { id: 3, title: "Finalize", icon: Settings2 },
];

const emptyService: Omit<PartnerService, "id"> = {
  name: "Ganesh Pooja",
  category: "Pooja",
  description: "Traditional Vrata Pooja",
  duration: "1h 30m",
  basePrice: 0,
  customPrice: false,
  visitType: "Home Visit",
  requiredItems: ["Coconut", "Flowers", "Betel Leaves"],
  enabled: true,
  packages: [
    { name: "Basic", price: 2500, description: "Standard Pooja with basic items" },
    { name: "Standard", price: 4000, description: "Comprehensive Pooja with materials" },
    { name: "Premium", price: 6000, description: "Grand Ritual with elaborate setup" },
  ],
};

export function AddServiceStepForm({ 
  onBack, 
  initialData, 
  onSave 
}: { 
  onBack: () => void; 
  initialData?: PartnerService | null;
  onSave: (service: Omit<PartnerService, "id"> & { id?: string }) => void;
}) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Omit<PartnerService, "id">>(
    initialData ? { ...initialData } : emptyService
  );
  const [tagInput, setTagInput] = React.useState("");

  const categories = ["Pooja", "Homam", "Ceremony", "Astrology", "Other"];

  const hoursList = Array.from({ length: 13 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];

  const getDurationParts = (duration: string) => {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    const hours = match ? parseInt(match[1]) : 0;
    const minutes = match ? parseInt(match[2]) : 0;
    return { hours, minutes };
  };

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

  const handleHourChange = (h: number) => {
    const { minutes } = getDurationParts(formData.duration);
    const durationStr = `${h}h ${minutes}m`;
    updateField("duration", durationStr);
    if (errors.duration) setErrors(prev => {
      const next = { ...prev };
      delete next.duration;
      return next;
    });
  };

  const handleMinuteChange = (m: number) => {
    const { hours } = getDurationParts(formData.duration);
    const durationStr = `${hours}h ${m}m`;
    updateField("duration", durationStr);
    if (errors.duration) setErrors(prev => {
      const next = { ...prev };
      delete next.duration;
      return next;
    });
  };

  const handleFinalSave = () => {
    if (initialData) {
      onSave({ ...formData, id: initialData.id });
    } else {
      onSave(formData);
    }
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateStep = () => {
    try {
      if (currentStep === 1) {
        step1Schema.parse(formData);
      } else if (currentStep === 2) {
        step2Schema.parse({ packages: formData.packages });
      } else if (currentStep === 3) {
        step3Schema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join("_");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const isStepValid = () => {
    try {
      if (currentStep === 1) {
        step1Schema.parse(formData);
      } else if (currentStep === 2) {
        step2Schema.parse({ packages: formData.packages });
      } else if (currentStep === 3) {
        step3Schema.parse(formData);
      }
      return true;
    } catch {
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        setErrors({});
      } else {
        handleFinalSave();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  useSetShell({
    title: (
      <PageHeader 
        title={initialData ? "Edit Service" : "Add New Service"} 
        onBack={prevStep}
      />
    ),
    bottomNav: null,
  });

  return (
    <div className="space-y-6 pb-28 relative min-h-full">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-6 px-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-white shadow-sm",
                    isActive ? "bg-[#FF9933] text-white scale-110" : 
                    isCompleted ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  isActive ? "text-[#FF9933]" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-200 -mt-6 mx-1">
                  <div 
                    className={cn("h-full bg-[#FF9933] transition-all duration-500", 
                    currentStep > step.id ? "w-full" : "w-0")} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Card className="p-6 border-none shadow-orange-100/50">
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label className="text-slate-600 ml-1">Service Name</Label>
                <Input 
                  placeholder="e.g. Satyanarayana Pooja" 
                  value={formData.name} 
                  onChange={(e) => {
                    updateField("name", e.target.value);
                    if (errors.name) setErrors(prev => {
                      const next = { ...prev };
                      delete next.name;
                      return next;
                    });
                  }}
                  className={cn(
                    "bg-white border-slate-200 focus:border-[#FF9933] transition-all shadow-sm",
                    errors.name && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 ml-1">Category</Label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      updateField("category", e.target.value);
                      if (errors.category) setErrors(prev => {
                        const next = { ...prev };
                        delete next.category;
                        return next;
                      });
                    }}
                    className={cn(
                      "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
                      errors.category && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                    )}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.category && <p className="text-[10px] text-red-500 ml-1">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 ml-1">Description</Label>
                <Textarea 
                  placeholder="Describe the service details..." 
                  rows={2}
                  value={formData.description} 
                  onChange={(e) => {
                    updateField("description", e.target.value);
                    if (errors.description) setErrors(prev => {
                      const next = { ...prev };
                      delete next.description;
                      return next;
                    });
                  }}
                  className={cn(
                    "bg-white border-slate-200 focus:border-[#FF9933] transition-all resize-none shadow-sm",
                    errors.description && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  )}
                />
                {errors.description && <p className="text-[10px] text-red-500 ml-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-slate-600 ml-1 text-xs">Estimated Duration</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <select
                        value={getDurationParts(formData.duration).hours}
                        onChange={(e) => handleHourChange(parseInt(e.target.value))}
                        className={cn(
                          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
                          errors.duration && "border-red-500"
                        )}
                      >
                        {hoursList.map((h) => (
                          <option key={h} value={h}>
                            {h} Hr{h !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                      <select
                        value={getDurationParts(formData.duration).minutes}
                        onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
                        className={cn(
                          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
                          errors.duration && "border-red-500"
                        )}
                      >
                        {minutesList.map((m) => (
                          <option key={m} value={m}>
                            {m} Min{m !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  {errors.duration && <p className="text-[10px] text-red-500 ml-1">{errors.duration}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600 ml-1 text-xs">Visit Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Home Visit", "Temple Visit", "Both"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField("visitType", type)}
                        className={cn(
                          "py-2 px-1 text-[10px] font-bold rounded-xl border transition-all",
                          formData.visitType === type 
                            ? "bg-orange-100 border-[#FF9933] text-[#B35300]" 
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">Custom Price Option</p>
                    <p className="text-[10px] text-slate-500">Allow customers to request quotes</p>
                  </div>
                  <Switch 
                    checked={formData.customPrice} 
                    onCheckedChange={(val) => updateField("customPrice", val)} 
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {["Basic", "Standard", "Premium"].map((pack, idx) => {
                const pkg = formData.packages?.[idx] || { name: pack as any, price: 0, description: "" };
                
                const packageStyles = {
                  Basic: {
                    container: "bg-[#F8EFE6] border-[#E2C7AF] shadow-sm shadow-orange-200/40",
                    title: "text-[#9A3412]",
                    glow: "bg-[#E7B98A]"
                  },
                  Standard: {
                    container: "bg-[#EEF6F0] border-[#BFE3CC] shadow-sm shadow-green-200/40 ring-1 ring-green-300/60",
                    title: "text-[#166534]",
                    glow: "bg-[#86D19E]"
                  },
                  Premium: {
                    container: "bg-[#F7ECEF] border-[#E3B8C2] shadow-sm shadow-rose-200/40",
                    title: "text-[#9F1239]",
                    glow: "bg-[#F2A7B5]"
                  }
                }[pack as "Basic" | "Standard" | "Premium"];
                
                return (
                  <div key={pack} className={cn("p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:scale-[1.01]", packageStyles.container)}>
                    {/* Decorative Glow Bubble */}
                    <div className={cn(
                      "pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 rounded-full opacity-30 blur-2xl",
                      packageStyles.glow
                    )} />

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", packageStyles.glow.replace('bg-', 'bg-opacity-80 bg-'))} />
                          <h4 className={cn("font-bold text-md", packageStyles.title)}>{pack} Package</h4>
                        </div>
                        <Package className="w-5 h-5 text-slate-400/50" />
                      </div>
                      
                      <div className="space-y-2.5">
                        <Label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Price (INR)</Label>
                        <Input 
                          icon={<IndianRupee className="w-4 h-4 text-slate-400" />}
                          placeholder="0.00" 
                          type="number"
                          value={pkg.price || ""} 
                          onChange={(e) => {
                            const val = e.target.value === "" ? 0 : Number(e.target.value);
                            const newPacks = [...(formData.packages || [])];
                            newPacks[idx] = { ...pkg, price: val };
                            updateField("packages", newPacks);
                            if (errors[`packages_${idx}_price`] && val > 0) {
                              setErrors(prev => {
                                const next = { ...prev };
                                delete next[`packages_${idx}_price`];
                                return next;
                              });
                            }
                          }}
                          className={cn(
                            "bg-white/60 border-slate-200 text-slate-900 h-12 text-base font-bold tabular-nums rounded-2xl placeholder:text-slate-400 focus:bg-white focus:border-[#FF9933]/50 transition-all shadow-sm",
                            errors[`packages_${idx}_price`] && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                          )}
                        />
                        {errors[`packages_${idx}_price`] && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors[`packages_${idx}_price`]}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Short Description</Label>
                        <Input 
                          placeholder={`What's included in ${pack.toLowerCase()}?`}
                          value={pkg.description} 
                          onChange={(e) => {
                            const val = e.target.value;
                            const newPacks = [...(formData.packages || [])];
                            newPacks[idx] = { ...pkg, description: val };
                            updateField("packages", newPacks);
                            if (errors[`packages_${idx}_description`] && val.trim()) {
                              setErrors(prev => {
                                const next = { ...prev };
                                delete next[`packages_${idx}_description`];
                                return next;
                              });
                            }
                          }}
                          className={cn(
                            "bg-white/60 border-slate-200 text-slate-900 h-11 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#FF9933]/50 rounded-2xl transition-all shadow-sm",
                            errors[`packages_${idx}_description`] && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                          )}
                        />
                      </div>
                      {errors[`packages_${idx}_description`] && <p className="text-[10px] text-red-500 ml-1 font-bold">{errors[`packages_${idx}_description`]}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <Label className="text-slate-600 ml-1">Required Items</Label>
                
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

                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="e.g. Flowers, Milk" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(tagInput);
                      } else if (e.key === "," || e.key === " ") {
                        if (tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }
                    }}
                    className="pl-10 pr-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#FF9933] hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 ml-1 font-medium">
                  Press <kbd className="font-sans px-1 bg-slate-100 rounded border border-slate-200">Enter</kbd> or <kbd className="font-sans px-1 bg-slate-100 rounded border border-slate-200">Comma</kbd> to add items
                </p>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900">Enable Service</p>
                    <p className="text-[11px] text-slate-500">Make this service visible to customers</p>
                  </div>
                  <Switch 
                    checked={formData.enabled} 
                    onCheckedChange={(val) => updateField("enabled", val)} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Floating Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 z-50">
        <Button
          variant="secondary"
          className="flex-1 rounded-xl h-12 font-bold"
          onClick={prevStep}
        >
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          className="flex-2 rounded-xl h-12 font-bold min-w-[140px]"
          onClick={nextStep}
        >
          {currentStep === steps.length ? "Save Service" : "Next Step"}
          {currentStep < steps.length && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
