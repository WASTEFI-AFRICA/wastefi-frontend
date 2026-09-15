"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MaterialType } from "@/types/api";

/**
 * Material Type Selector
 * Choose the type of waste material
 */

interface MaterialOption {
  type: MaterialType;
  label: string;
  rate: number; // USD per kg
  emoji: string;
}

const materials: MaterialOption[] = [
  { type: "PET_PLASTIC", label: "PET Plastic", rate: 1.0, emoji: "♻️" },
  { type: "HDPE_PLASTIC", label: "HDPE Plastic", rate: 0.9, emoji: "🥤" },
  { type: "MIXED_PLASTIC", label: "Mixed Plastic", rate: 0.7, emoji: "🗑️" },
  { type: "CARDBOARD", label: "Cardboard", rate: 0.5, emoji: "📦" },
  { type: "PAPER", label: "Paper", rate: 0.4, emoji: "📄" },
  { type: "ALUMINUM", label: "Aluminum", rate: 1.5, emoji: "🥫" },
  { type: "STEEL", label: "Steel", rate: 0.8, emoji: "🔩" },
  { type: "GLASS", label: "Glass", rate: 0.3, emoji: "🍾" },
  { type: "E_WASTE", label: "E-Waste", rate: 2.0, emoji: "💻" },
  { type: "OTHER", label: "Other", rate: 0.5, emoji: "🔄" },
];

interface MaterialTypeSelectorProps {
  selected: MaterialType | null;
  onSelect: (type: MaterialType) => void;
}

export function MaterialTypeSelector({ selected, onSelect }: MaterialTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {materials.map((material) => {
        const isSelected = selected === material.type;

        return (
          <button
            key={material.type}
            type="button"
            onClick={() => onSelect(material.type)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all text-left relative",
              isSelected
                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                : "border-[var(--border)] hover:border-[var(--primary)]/50"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{material.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{material.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  ${material.rate}/kg
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Export materials for use in other components
export { materials };
