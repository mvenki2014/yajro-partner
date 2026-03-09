import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CornerOrnament, BottomOrnament } from './DialogGraphics';

interface DialogBackgroundProps {
  variant?: "default" | "destructive";
  className?: string;
}

export function DialogBackground({ variant = "default", className }: DialogBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden rounded-3xl", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl",
          variant === "destructive" ? "bg-red-200/30" : "bg-orange-200/30"
        )}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.1 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className={cn(
          "absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl",
          variant === "destructive" ? "bg-red-100/20" : "bg-orange-100/20"
        )}
      />
      {/* Subtle dots pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: `radial-gradient(${variant === "destructive" ? "#ef4444" : "#f97316"} 1px, transparent 1px)`, 
          backgroundSize: '16px 16px' 
        }} 
      />
      {/* Decorative corner graphic */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] pointer-events-none">
        <CornerOrnament variant={variant} />
      </div>
      {/* Decorative bottom graphic */}
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-[0.05] pointer-events-none">
        <BottomOrnament variant={variant} />
      </div>
    </div>
  );
}
