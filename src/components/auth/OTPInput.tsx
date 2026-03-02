import * as React from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  length?: number;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  onEnter,
  length = 6,
  className,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    // Focus the first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newValue = value.split("");
    // Only take the last character if the user typed something new
    newValue[index] = val.slice(-1);
    const updatedValue = newValue.join("");
    onChange(updatedValue);

    // Move to next box if value is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && onEnter && value.length === length) {
      onEnter();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;
    onChange(pastedData);
    
    // Focus the last filled box or the next empty box
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < length; i++) {
      inputs.push(
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm outline-none focus:ring-2 focus:ring-orange-200/50 focus:border-orange-400 focus:bg-white transition-all shadow-sm"
        />
      );

      // Add a separator dot after the 3rd box if length is 6
      if (length === 6 && i === 2) {
        inputs.push(
          <div key="divider" className="flex items-center justify-center mx-0.5">
            <div className="w-2.5 h-0.5 bg-slate-400/40 rounded-xl" />
          </div>
        );
      }
    }
    return inputs;
  };

  return (
    <div className={cn("flex justify-center items-center gap-2", className)}>
      {renderInputs()}
    </div>
  );
}
