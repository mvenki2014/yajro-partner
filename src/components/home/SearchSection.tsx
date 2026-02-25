import * as React from "react";

interface SearchSectionProps {
  query: string;
  setQuery: (query: string) => void;
}

export function SearchSection({ query, setQuery }: SearchSectionProps) {
  return (
    <div>
      <label className="text-base font-semibold mb-3 block">
        Search for a Pooja
      </label>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Poojas, Samagri, and more..."
          className="w-full rounded-2xl bg-white px-4 py-4 pr-12 text-sm ring-1 ring-slate-200 shadow-md outline-none focus:ring-2 focus:ring-[#FF9933]/45 transition-all"
        />
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
