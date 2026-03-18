import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function SectionCard({
  icon,
  title,
  children,
}: SectionCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm transition-all duration-300">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-slate-500">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-400 ring-1 ring-orange-200/40">
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">{children}</CardContent>
    </Card>
  );
}
