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

import { TextField, Card, Flex, Text, IconButton, Box, Badge, Spinner } from "@radix-ui/themes";

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
    <Box position="relative" width="100%" maxWidth="400px" ref={searchRef}>
      
      {/* Search Bar */}
      <TextField.Root 
        size="3" 
        placeholder="Search by Name, Phone, or Code..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      >
        <TextField.Slot>
          <Search width={16} height={16} />
        </TextField.Slot>
        {query && (
          <TextField.Slot>
            <IconButton size="1" variant="ghost" radius="full" onClick={() => { setQuery(""); setResults([]); }}>
              <X width={14} height={14} />
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>

      {/* Results Dropdown */}
      {isOpen && query.trim() && (
        <Card 
          size="2"
          variant="classic"
          style={{ 
            position: "absolute", 
            top: "calc(100% + 8px)", 
            left: 0, 
            right: 0, 
            zIndex: 100, 
            maxHeight: "400px", 
            overflowY: "auto",
            boxShadow: "var(--shadow-5)"
          }}
        >
          {isSearching ? (
            <Flex direction="column" align="center" justify="center" py="6" gap="2">
              <Spinner size="3" />
              <Text size="2" color="gray">Searching...</Text>
            </Flex>
          ) : results.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py="6">
              <Text size="2" color="gray">No results found for "{query}".</Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="2">
              {results.map((res, idx) => (
                <Flex 
                  key={`${res.guest_id}-${res.event_slug}-${idx}`}
                  onClick={() => handleResultClick(res.guest_id)}
                  direction="column"
                  p="3"
                  gap="2"
                  style={{ 
                    cursor: "pointer", 
                    borderRadius: "var(--radius-3)",
                    backgroundColor: "var(--color-surface)",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--gray-3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface)")}
                >
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      <Badge size="1" color={res.event_slug === 'wedding' ? 'ruby' : 'pink'} variant="soft">
                        {res.event_name.toUpperCase()}
                      </Badge>
                      <Text size="3" weight="bold">{res.name}</Text>
                    </Flex>
                    <Badge size="1" color="gray" variant="surface" style={{ fontFamily: "monospace" }}>
                      {res.invitation_code}
                    </Badge>
                  </Flex>
                  
                  <Flex align="center" gap="4">
                    <Flex align="center" gap="1">
                      <User width={12} height={12} style={{ color: "var(--gray-9)" }} />
                      <Text size="2" color="gray">
                        {res.status === 'attending' ? res.confirmed_pax : res.max_pax} pax
                      </Text>
                    </Flex>
                    <Text 
                      size="2" 
                      weight="medium" 
                      color={res.status === 'attending' ? 'green' : res.status === 'not_attending' ? 'ruby' : 'gray'}
                    >
                      {res.status === 'attending' ? 'Attending' : res.status === 'not_attending' ? 'Declined' : 'Pending'}
                    </Text>
                    {res.table && (
                      <Badge size="1" color="blue" variant="soft">
                        {res.table}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </Card>
      )}
    </Box>
  );
}
