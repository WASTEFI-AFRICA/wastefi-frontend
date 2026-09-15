"use client";

import { format } from "date-fns";
import { Package, MapPin, Scale, DollarSign, ChevronRight } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { CollectionStatusBadge } from "./CollectionStatusBadge";
import type { WasteSubmission } from "@/types/api";

/**
 * Collection Card
 * Display individual collection item
 */

interface CollectionCardProps {
  collection: WasteSubmission;
  onClick?: () => void;
}

export function CollectionCard({ collection, onClick }: CollectionCardProps) {
  const isClickable = !!onClick;

  return (
    <Card
      className={`${
        isClickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Material Icon */}
          <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-[var(--primary)]" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold capitalize truncate">
                  {collection.materialType.replace("-", " ")}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {format(new Date(collection.createdAt), "MMM dd, yyyy • HH:mm")}
                </p>
              </div>
              <CollectionStatusBadge status={collection.status} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Scale className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>{collection.weight} kg</span>
              </div>
              {collection.estimatedValue && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[var(--success)]" />
                  <span className="font-medium text-[var(--success)]">
                    ${collection.estimatedValue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Location */}
            {collection.location && (
              <div className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">
                  Lat: {collection.location.lat.toFixed(4)}, Lng: {collection.location.lng.toFixed(4)}
                </span>
              </div>
            )}

            {/* Photos count */}
            {collection.photos.length > 0 && (
              <div className="mt-2">
                <Badge variant="outline" size="sm">
                  {collection.photos.length} {collection.photos.length === 1 ? "photo" : "photos"}
                </Badge>
              </div>
            )}
          </div>

          {/* Arrow */}
          {isClickable && (
            <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-1" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
