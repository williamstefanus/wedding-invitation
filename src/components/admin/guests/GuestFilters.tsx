"use client";

import { Search } from "lucide-react";

interface GuestFiltersProps {
  currentSearch: string;
  currentOwner: string;
  currentCategory: string;
  currentSort: string;
  updateUrl: (updates: Record<string, string | null>) => void;
  config?: any;
}

export function GuestFilters({
  currentSearch,
  currentOwner,
  currentCategory,
  currentSort,
  updateUrl,
  config = {}
}: GuestFiltersProps) {
  const groomName = config.groomFirstName || "John";
  const brideName = config.brideFirstName || "Jane";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name..." 
          defaultValue={currentSearch}
          onChange={(e) => updateUrl({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto flex-wrap">
        <select 
          value={currentOwner} 
          onChange={e => updateUrl({ owner: e.target.value })}
          className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        >
          <option value="All">All Owners</option>
          <option value="groom">{groomName}</option>
          <option value="bride">{brideName}</option>
        </select>
        <select 
          value={currentCategory} 
          onChange={e => updateUrl({ category: e.target.value })}
          className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        >
          <option value="All">All Categories</option>
          <option value="Relatives">Relatives</option>
          <option value="Friends">Friends</option>
          <option value="Church">Church</option>
        </select>
        <select 
          value={currentSort || "default"} 
          onChange={e => updateUrl({ sort: e.target.value })}
          className="flex-1 md:w-40 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        >
          <option value="default">Sort: Latest</option>
          <option value="az">Sort: A → Z</option>
          <option value="za">Sort: Z → A</option>
        </select>
      </div>
    </div>
  );
}
