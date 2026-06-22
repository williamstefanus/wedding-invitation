"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Link as LinkIcon, User } from "lucide-react";
import { globalSearch } from "@/lib/actions/search";

// Hook to debounce search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      const res = await globalSearch(debouncedQuery);
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedQuery]);

  const handleResultClick = (guestId: string) => {
    setIsOpen(false);
    setQuery("");
    // Navigate to Guest Detail page
    router.push(`/admin/guests/${guestId}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by Name, Phone, or Code..."
          className="w-full pl-9 pr-10 py-2 bg-slate-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3 p-0.5 bg-slate-200 hover:bg-slate-300 text-slate-500 rounded-full transition"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] max-h-96 flex flex-col animate-fade-down">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-amber-500" />
              <p className="text-sm">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm">No results found for "{query}".</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-2 flex flex-col gap-1">
              {results.map((res, idx) => (
                <div 
                  key={`${res.guest_id}-${res.event_slug}-${idx}`}
                  onClick={() => handleResultClick(res.guest_id)}
                  className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-100 group"
                >
                  {/* Event Badge */}
                  <div className={`mt-0.5 shrink-0 px-2 py-1 text-[10px] font-bold rounded ${res.event_slug === 'wedding' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {res.event_name.toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-800 text-sm truncate group-hover:text-amber-600 transition">
                        {res.name}
                      </p>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {res.invitation_code}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {res.status === 'attending' ? res.confirmed_pax : res.max_pax} pax
                      </span>
                      <span className={`font-medium ${res.status === 'attending' ? 'text-green-600' : res.status === 'not_attending' ? 'text-rose-500' : 'text-slate-400'}`}>
                        {res.status === 'attending' ? 'Attending' : res.status === 'not_attending' ? 'Declined' : 'Pending'}
                      </span>
                      {res.table && (
                        <span className="font-medium text-blue-600 bg-blue-50 px-1.5 rounded">
                          {res.table}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
