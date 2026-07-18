"use client";

import { Search } from "lucide-react";
import { Flex, TextField, Select, Box } from "@radix-ui/themes";

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
  const groomName = config.groomFirstName || "William";
  const brideName = config.brideFirstName || "Aziel";

  return (
    <Flex gap="3" wrap="wrap" mb="1" align="center">
      <Box style={{ flexGrow: 1, minWidth: "200px" }}>
        <TextField.Root
          size="3"
          placeholder="Search by name..." 
          defaultValue={currentSearch} 
          onChange={(e: any) => updateUrl({ search: e.target.value })}
        >
          <TextField.Slot>
            <Search width={16} height={16} />
          </TextField.Slot>
        </TextField.Root>
      </Box>
      <Select.Root size="3" value={currentOwner || "All"} onValueChange={v => updateUrl({ owner: v })}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="All">All Owners</Select.Item>
          <Select.Item value="groom">{groomName}</Select.Item>
          <Select.Item value="bride">{brideName}</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="3" value={currentCategory || "All"} onValueChange={v => updateUrl({ category: v })}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="All">All Categories</Select.Item>
          <Select.Item value="Relatives">Relatives</Select.Item>
          <Select.Item value="Friends">Friends</Select.Item>
          <Select.Item value="Church">Church</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="3" value={currentSort || "default"} onValueChange={v => updateUrl({ sort: v })}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="default">Sort: Latest</Select.Item>
          <Select.Item value="az">Sort: A → Z</Select.Item>
          <Select.Item value="za">Sort: Z → A</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
