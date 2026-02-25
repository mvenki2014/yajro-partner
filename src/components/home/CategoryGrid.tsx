import * as React from "react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  onNavigate?: (page: string, categoryId?: string) => void;
}

export function CategoryGrid({ categories, onNavigate }: CategoryGridProps) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <label className="text-base font-semibold block">
          Categories
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {categories.slice(0, 6).map((c) => {
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onNavigate?.("services", c.id)}
              className="rounded-xl bg-white ring-1 ring-slate-200/70 p-3 text-left shadow-lg hover:bg-slate-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF9933]/20 text-[#B35300]">
                <img src={c.icon} className="h-10 w-10 mix-blend-multiply" alt={c.name} />
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-900 leading-snug">
                {c.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
