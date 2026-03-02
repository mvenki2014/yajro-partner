import * as React from "react";

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isScrolled: boolean;
}

export function ServiceFilters({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  isScrolled,
}: ServiceFiltersProps) {
  return (
    <div
      className={`z-30 pb-3 transition-all duration-300 px-4 bg-transparent sticky top-0 ${
        isScrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-b border-b-slate-200/50" : ""
      }`}
    >
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative group">
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your services..."
            className="w-full rounded-2xl bg-white px-4 py-3 pr-12 text-sm ring-1 ring-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-[#FF9933]/45 transition-all group-hover:ring-slate-300"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF9933] transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
        </div>

        {/* Category Chips */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-2 min-w-max py-0.5">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-300 active:scale-95 ${
                    isActive
                      ? "bg-[#FF9933] text-white shadow-lg shadow-orange-200/50"
                      : "bg-white text-slate-600 border border-slate-200/60 hover:border-orange-200 hover:text-orange-500 shadow-sm"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
