"use client";

import { MapPin, Clock, Phone, Star, CheckCircle2 } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import { calculateDistance, formatDistance } from "@/lib/utils/geolocation";

/**
 * Collection Point List
 * Displays list of collection points with distance
 */

interface CollectionPointListProps {
  points: CollectionPoint[];
  userLocation?: Coordinates | null;
  selectedPoint?: CollectionPoint | null;
  onPointSelect?: (point: CollectionPoint) => void;
}

export function CollectionPointList({
  points,
  userLocation,
  selectedPoint,
  onPointSelect,
}: CollectionPointListProps) {
  // Sort by distance if user location available
  const sortedPoints = userLocation
    ? [...points].sort((a, b) => {
        const distA = calculateDistance(userLocation, a.location);
        const distB = calculateDistance(userLocation, b.location);
        return distA - distB;
      })
    : points;

  if (points.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-3" />
          <p className="text-[var(--muted-foreground)]">
            No collection points found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedPoints.map((point) => {
        const isSelected = selectedPoint?.id === point.id;
        const distance = userLocation
          ? calculateDistance(userLocation, point.location)
          : null;

        return (
          <Card
            key={point.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-[var(--primary)] shadow-md"
                : ""
            }`}
            onClick={() => onPointSelect?.(point)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Name and badges */}
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-semibold text-base leading-tight">
                      {point.name}
                    </h3>
                    {point.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-[var(--muted-foreground)] mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{point.address}</span>
                  </div>

                  {/* Operating hours */}
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-3">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {point.operatingHours.open} - {point.operatingHours.close}
                    </span>
                  </div>

                  {/* Contact */}
                  {point.contact?.phone && (
                    <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-3">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{point.contact.phone}</span>
                    </div>
                  )}

                  {/* Materials */}
                  <div className="flex flex-wrap gap-1.5">
                    {point.acceptedMaterials.slice(0, 3).map((material) => (
                      <Badge key={material} variant="outline" size="sm">
                        {material}
                      </Badge>
                    ))}
                    {point.acceptedMaterials.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{point.acceptedMaterials.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {point.rating && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-4 h-4 fill-[var(--warning)] text-[var(--warning)]" />
                      <span className="text-sm font-medium">
                        {point.rating.toFixed(1)}
                      </span>
                      {point.totalCollections && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          ({point.totalCollections} collections)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Distance */}
                {distance !== null && (
                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-bold text-[var(--primary)]">
                      {formatDistance(distance)}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      away
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
