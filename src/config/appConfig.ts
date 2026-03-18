export const PACKAGE_CONFIGS = {
  Basic: {
    container: "bg-gradient-to-br from-white to-[#F8EFE6] border-[#E2C7AF] shadow-sm shadow-orange-200/40",
    title: "text-[#9A3412]",
    glow: "bg-[#E7B98A]",
    iconBg: "bg-orange-100/70",
    iconColor: "text-orange-600",
    price: "bg-orange-100 text-[#9A3412]",
    badge: "bg-orange-100/80 text-[#9A3412]",
  },
  Standard: {
    container: "bg-gradient-to-br from-white to-[#EEF6F0] border-[#BFE3CC] shadow-sm shadow-green-200/40",
    title: "text-[#166534]",
    glow: "bg-[#86D19E]",
    iconBg: "bg-green-100/70",
    iconColor: "text-green-600",
    price: "bg-green-100 text-[#166534]",
    badge: "bg-green-100/80 text-[#166534]",
  },
  Premium: {
    container: "bg-gradient-to-br from-white to-[#F7ECEF] border-[#E3B8C2] shadow-sm shadow-rose-200/40",
    title: "text-[#9F1239]",
    glow: "bg-[#F2A7B5]",
    iconBg: "bg-rose-100/70",
    iconColor: "text-rose-600",
    price: "bg-rose-100 text-[#9F1239]",
    badge: "bg-rose-100/80 text-[#9F1239]",
  },
} as const;
