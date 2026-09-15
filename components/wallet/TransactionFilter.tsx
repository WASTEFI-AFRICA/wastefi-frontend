"use client";

import { Button } from "@/components/ui";
import { Filter } from "lucide-react";

/**
 * Transaction Filter Component
 * Filter transactions by type and status
 */

export type TransactionFilterType = "all" | "credit" | "debit";

interface TransactionFilterProps {
  activeFilter: TransactionFilterType;
  onFilterChange: (filter: TransactionFilterType) => void;
}

export function TransactionFilter({
  activeFilter,
  onFilterChange,
}: TransactionFilterProps) {
  const filters: { value: TransactionFilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "credit", label: "Received" },
    { value: "debit", label: "Sent" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <Filter className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "primary" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="whitespace-nowrap"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
