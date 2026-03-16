import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KYC_MESSAGES } from "@/config/messageConstants";

interface KycWarningRibbonProps {
  onAction?: () => void;
}

export function KycWarningRibbon({ onAction }: KycWarningRibbonProps) {
  return (
    <div className="mx-auto flex w-full max-w-[460px] items-center gap-2 border-t border-red-300 bg-red-600 px-3 py-2 text-white shadow-lg">
      <AlertTriangle className="h-4 w-4 shrink-0" />

      <p className="min-w-0 flex-1 truncate text-[11px] font-semibold">
        {KYC_MESSAGES.ribbonDescription}
      </p>

      {onAction ? (
        <Button
          type="button"
          size="xs"
          variant="secondary"
          className="h-6 shrink-0 rounded-md bg-white px-2.5 text-[10px] font-bold text-red-700 hover:bg-red-50"
          onClick={onAction}
        >
          {KYC_MESSAGES.ribbonAction}
        </Button>
      ) : null}
    </div>
  );
}
