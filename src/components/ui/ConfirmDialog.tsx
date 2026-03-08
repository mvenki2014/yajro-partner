import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DialogBackground } from "@/components/layout/DialogBackground";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90%] w-[320px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-gradient-to-br from-white to-[#FFF9F2] z-[100]">
        <DialogBackground variant={variant} />

        <div className="p-5 pt-7 pb-1 flex flex-col items-center text-center relative z-10">
          {icon && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center mb-5 ring-4 shadow-sm",
                variant === "destructive" ? "bg-red-50 ring-red-50/30 text-red-500" : "bg-orange-50 ring-orange-50/30 text-orange-500"
              )}
            >
              {icon}
            </motion.div>
          )}
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <DialogHeader className="p-0 space-y-1.5">
              <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">{title}</DialogTitle>
              <DialogDescription className="text-xs text-slate-500 leading-relaxed font-medium px-4">
                {description}
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative z-10"
        >
          <DialogFooter className="m-0 bg-transparent border-none flex-row p-5 pt-2 pb-5 gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-9 rounded-xl font-bold bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              onClick={() => onOpenChange(false)}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              className={cn(
                "flex-1 h-9 rounded-xl font-bold transition-all active:scale-95",
                variant === "destructive" 
                  ? "shadow-lg shadow-red-200/50" 
                  : "shadow-lg shadow-orange-200/50"
              )}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmText}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
