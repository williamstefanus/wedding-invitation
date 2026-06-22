"use client";

import { Search } from "lucide-react";

interface RsvpFiltersProps {
  currentSearch: string;
  currentEventType: string;
  currentOwner: string;
  currentCategory: string;
  currentStatus: string;
  eventTypes: any[];
  updateUrl: (updates: Record<string, string | null>) => void;
}

export function RsvpFilters({
  currentSearch,
  currentEventType,
  currentOwner,
  currentCategory,
  currentStatus,
  eventTypes,
  updateUrl
}: RsvpFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search guest..." 
          defaultValue={currentSearch}
          onChange={(e) => updateUrl({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>
      
      <select 
        value={currentEventType} 
        onChange={(e) => updateUrl({ eventType: e.target.value })}
        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      >
        <option value="All">All Event Types</option>
        {eventTypes.map((et: any) => (
          <option key={et.id} value={et.slug}>{et.name}</option>
        ))}
      </select>

      <select 
        value={currentOwner} 
        onChange={(e) => updateUrl({ owner: e.target.value })}
        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      >
        <option value="All">All Owners</option>
        <option value="William">William</option>
        <option value="Aziel">Aziel</option>
      </select>

      <select 
        value={currentCategory} 
        onChange={(e) => updateUrl({ category: e.target.value })}
        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      >
        <option value="All">All Categories</option>
        <option value="Relatives">Relatives</option>
        <option value="Friends">Friends</option>
        <option value="Church">Church</option>
      </select>

      <select 
        value={currentStatus} 
        onChange={(e) => updateUrl({ status: e.target.value })}
        className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      >
        <option value="All">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="attending">Attending</option>
        <option value="not_attending">Declined</option>
      </select>
    </div>
  );
}
