"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import type { CollectionStatus, MaterialType } from "@/types/api";

/**
 * Collection Filter
 * Filter collections by status and material type
 */

interface CollectionFilterProps {
  onStatusFilter: (statuses: CollectionStatus[]) => void;
  onMaterialFilter: (materials: MaterialType[]) => void;
  selectedStatuses: CollectionStatus[];
  selectedMaterials: MaterialType[];
}

const statuses: CollectionStatus[] = ["pending", "verified", "rejected", "paid"];

const materials: MaterialType[] = [
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

export function CollectionFilter({
  onStatusFilter,
  onMaterialFilter,
  selectedStatuses,
  selectedMaterials,
}: CollectionFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleStatus = (status: CollectionStatus) => {
    const newSelection = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusFilter(newSelection);
  };

  const toggleMaterial = (material: MaterialType) => {
    const newSelection = selectedMaterials.includes(material)
      ? selectedMaterials.filter((m) => m !== material)
      : [...selectedMaterials, material];
    onMaterialFilter(newSelection);
  };

  const clearFilters = () => {
    onStatusFilter([]);
    onMaterialFilter([]);
    setShowFilters(false);
  };

  const hasActiveFilters = selectedStatuses.length > 0 || selectedMaterials.length > 0;

  return (
    <div className="space-y-3">
      {/* Filter toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant={showFilters || hasActiveFilters ? "primary" : "outline"}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2">({selectedStatuses.length + selectedMaterials.length})</span>
          )}
        </Button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--primary)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panels */}
      {showFilters && (
        <div className="space-y-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30">
          {/* Status filter */}
          <div>
            <h4 className="font-medium text-sm mb-3">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isSelected = selectedStatuses.includes(status);
                return (
                  <Badge
                    key={status}
                    variant={isSelected ? "primary" : "outline"}
                    size="md"
                    className="cursor-pointer capitalize"
                    onClick={() => toggleStatus(status)}
                  >
                    {status}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Material filter */}
          <div>
            <h4 className="font-medium text-sm mb-3">Material Type</h4>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => {
                const isSelected = selectedMaterials.includes(material);
                return (
                  <Badge
                    key={material}
                    variant={isSelected ? "primary" : "outline"}
                    size="md"
                    className="cursor-pointer capitalize"
                    onClick={() => toggleMaterial(material)}
                  >
                    {material.replace("-", " ")}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[var(--muted-foreground)]">Active:</span>
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="outline" size="sm" className="capitalize">
              {status}
              <button onClick={() => toggleStatus(status)} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedMaterials.map((material) => (
            <Badge key={material} variant="outline" size="sm" className="capitalize">
              {material.replace("-", " ")}
              <button onClick={() => toggleMaterial(material)} className="ml-1">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
