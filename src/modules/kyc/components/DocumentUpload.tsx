import * as React from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
}

export function DocumentUpload({ 
  label, 
  value, 
  onChange, 
  error, 
  disabled, 
  onFileSelect 
}: DocumentUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onFileSelect) {
      onFileSelect(file);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">{label}</Label>
      <div
        className={cn(
          "group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          value
            ? "border-emerald-200 bg-emerald-50/20"
            : "border-slate-200 bg-white hover:border-[#FF9933]/50 hover:bg-orange-50/30 shadow-sm",
          error && "border-red-200 bg-red-50/30",
          disabled && "cursor-not-allowed opacity-50 grayscale"
        )}
      >
        {value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="Document preview"
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur rounded-full px-4"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Change Photo
              </Button>
            </div>
            <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full py-8 gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover:scale-110 group-active:scale-95">
              <Upload className="h-5 w-5 text-slate-400 group-hover:text-[#FF9933]" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-slate-700 block">Tap to upload {label.toLowerCase()}</span>
              <span className="text-[11px] text-slate-400 font-medium">JPG, PNG or PDF (Max 5MB)</span>
            </div>
          </button>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-red-500 ml-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
}
