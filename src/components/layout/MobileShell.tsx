import * as React from "react";
import { cn } from "@/lib/utils";
import { useShellValues } from "@/context/ShellContext";

export function MobileShell({
                              title: titleProp,
                              children,
                              footer: footerProp,
                              bottomNav: bottomNavProp,
                            }: {
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bottomNav?: React.ReactNode;
}) {
  const { title: contextTitle, footer: contextFooter, bottomNav: contextBottomNav } = useShellValues();

  const title = titleProp !== undefined ? titleProp : contextTitle;
  const footer = footerProp !== undefined ? footerProp : contextFooter;
  const bottomNav = bottomNavProp !== undefined ? bottomNavProp : contextBottomNav;
  return (
    <div className={cn("app-container flex flex-col h-full bg-[#fff8ee] text-slate-900", !title && "bg-[#fff8ee7d]")}>
      <div className={cn(
        "mx-auto w-full max-w-[420px] flex-1 flex flex-col relative shadow-2xl shadow-slate-900/5 sm:border-x border-slate-200/50 overflow-hidden",
        !title && "bg-transparent shadow-none border-none"
      )}>

        {/* Decorative Top Graphic */}
        {title && (
          <div className="absolute top-0 inset-x-0 h-48 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF9933]/20 via-[#FF9933]/5 to-transparent" />
            <svg className="absolute -top-10 -right-10 w-48 h-48 text-[#FF9933]/10" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 C60 20 80 40 100 50 C80 60 60 80 50 100 C40 80 20 60 0 50 C20 40 40 20 50 0 Z" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="10" />
            </svg>
            <svg className="absolute -top-5 -left-8 w-32 h-32 text-amber-500/10" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 C60 20 80 40 100 50 C80 60 60 80 50 100 C40 80 20 60 0 50 C20 40 40 20 50 0 Z" />
            </svg>
          </div>
        )}

        <header className="sticky top-0 z-20">
          <div className={cn(
            "bg-white/70 backdrop-blur-md supports-backdrop-filter:bg-white/60",
            !title && "bg-transparent backdrop-blur-0"
          )}>
            <div className={cn("px-4 pb-3", title ? "pt-5" : "p-0")}>
              {title ? (
                <div className="flex items-center justify-between gap-3 relative z-10">{title}</div>
              ) : null}
            </div>
            {title && <div className="h-px bg-linear-to-r from-transparent via-[#FF9933]/20 to-transparent" />}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 relative z-10">
          {children}
        </main>

        {(footer || bottomNav) && (
          <footer className="shrink-0 z-30">
            {footer && (
              <div className="mx-auto w-full max-w-[420px] px-4 pb-4">
                <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 shadow-lg shadow-slate-900/5 p-3 pointer-events-auto">
                  {footer}
                </div>
              </div>
            )}
            {bottomNav && (
              <div className="mx-auto w-full max-w-[420px]">
                {bottomNav}
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
