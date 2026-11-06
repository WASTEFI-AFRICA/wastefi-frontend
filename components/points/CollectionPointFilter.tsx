"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { MaterialName } from "@/components/collections/MaterialName";

/**
 * Collection Point Filter
 * Search and filter collection points
 */

interface CollectionPointFilterProps {
  onSearchChange: (query: string) => void;
  onMaterialFilter: (materials: string[]) => void;
  selectedMaterials: string[];
  availableMaterials: string[];
}

export function CollectionPointFilter({
  onSearchChange,
  onMaterialFilter,
  selectedMaterials,
  availableMaterials,
}: CollectionPointFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const toggleMaterial = (material: string) => {
    const newSelection = selectedMaterials.includes(material)
      ? selectedMaterials.filter((m) => m !== material)
      : [...selectedMaterials, material];
    onMaterialFilter(newSelection);
  };

  const clearFilters = () => {
    setSearchQuery("");
    onSearchChange("");
    onMaterialFilter([]);
    setShowFilters(false);
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <input
            type="search"
            aria-label="Search collection points"
            placeholder="Search collection points..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-12 pl-10 pr-10 rounded-lg border border-[var(--border)] bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          variant={
            showFilters || selectedMaterials.length > 0 ? "primary" : "outline"
          }
          size="icon"
          className="h-12 w-12 shrink-0 rounded-lg"
          aria-label="Filter materials"
          aria-expanded={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
          {selectedMaterials.length > 0 && (
            <span className="ml-1">({selectedMaterials.length})</span>
          )}
        </Button>
      </div>

      {/* Material filters */}
      {showFilters && (
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filter by Material</h4>
            {selectedMaterials.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {availableMaterials.map((material) => {
              const isSelected = selectedMaterials.includes(material);
              return (
                <Button
                  key={material}
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  className="h-auto max-w-full whitespace-normal py-2 text-left"
                  aria-pressed={isSelected}
                  onClick={() => toggleMaterial(material)}
                >
                  <MaterialName code={material} />
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Button>
              );
            })}
          </div>
          {availableMaterials.length === 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Materials have not been listed for these points.
            </p>
          )}
        </div>
      )}

      {/* Active filters display */}
      {(searchQuery || selectedMaterials.length > 0) && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[var(--muted-foreground)]">
            Filters:
          </span>
          {searchQuery && (
            <Badge variant="outline" size="sm">
              &ldquo;{searchQuery}&rdquo;
              <button
                onClick={() => handleSearchChange("")}
                aria-label="Clear search filter"
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedMaterials.map((material) => (
            <Button
              key={material}
              variant="outline"
              size="sm"
              onClick={() => toggleMaterial(material)}
              className="h-auto max-w-full whitespace-normal py-1.5"
            >
              <MaterialName code={material} />
              <X className="w-3 h-3 ml-1 shrink-0" aria-hidden="true" />
            </Button>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--primary)] hover:underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
