"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import type { MaterialType } from "@/types/api";

/**
 * Collection Point Filter
 * Search and filter collection points
 */

interface CollectionPointFilterProps {
  onSearchChange: (query: string) => void;
  onMaterialFilter: (materials: MaterialType[]) => void;
  selectedMaterials: MaterialType[];
}

const availableMaterials: MaterialType[] = [
  "plastic",
  "paper",
  "metal",
  "glass",
  "e-waste",
  "textiles",
  "organic",
  "cardboard",
  "batteries",
  "mixed",
];

export function CollectionPointFilter({
  onSearchChange,
  onMaterialFilter,
  selectedMaterials,
}: CollectionPointFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const toggleMaterial = (material: MaterialType) => {
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search collection points..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--muted)] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          variant={showFilters || selectedMaterials.length > 0 ? "primary" : "outline"}
          size="lg"
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
                <Badge
                  key={material}
                  variant={isSelected ? "primary" : "outline"}
                  size="md"
                  className="cursor-pointer"
                  onClick={() => toggleMaterial(material)}
                >
                  {material}
                  {isSelected && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              );
            })}
          </div>
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
              "{searchQuery}"
              <button
                onClick={() => handleSearchChange("")}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedMaterials.map((material) => (
            <Badge
              key={material}
              variant="outline"
              size="sm"
            >
              {material}
              <button
                onClick={() => toggleMaterial(material)}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
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
