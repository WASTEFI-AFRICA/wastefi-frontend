"use client";

import { MapPin, Clock, Phone, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { MaterialName } from "@/components/collections/MaterialName";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import { calculateDistance, formatDistance } from "@/lib/utils/geolocation";

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
  const distanceTo = (point: CollectionPoint) =>
    userLocation && point.location
      ? calculateDistance(userLocation, point.location)
      : null;
  const sorted = userLocation
    ? [...points].sort(
        (a, b) => (distanceTo(a) ?? Infinity) - (distanceTo(b) ?? Infinity),
      )
    : points;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sorted.map((point) => {
        const distance = distanceTo(point);
        return (
          <Card
            key={point.id}
            className={`rounded-xl ${selectedPoint?.id === point.id ? "ring-2 ring-[var(--primary)]" : ""}`}
          >
            <CardContent className="p-5 flex h-full flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--accent)] flex items-center justify-center">
                  <MapPin
                    className="w-5 h-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h2 className="font-semibold leading-snug break-words">
                      {point.name}
                    </h2>
                    {point.verified && (
                      <CheckCircle2
                        className="w-4 h-4 mt-1 shrink-0 text-[var(--primary)]"
                        aria-label="Verified collection point"
                      />
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    {point.city}, {point.country}
                  </p>
                </div>
              </div>
              {point.description && (
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 break-words">
                  {point.description}
                </p>
              )}
              <p className="text-sm break-words">{point.address}</p>
              <div className="flex flex-wrap gap-1.5">
                {point.acceptedMaterials.slice(0, 3).map((material) => (
                  <Badge key={material} variant="outline">
                    <MaterialName code={material} />
                  </Badge>
                ))}
                {point.acceptedMaterials.length > 3 && (
                  <Badge variant="outline">
                    +{point.acceptedMaterials.length - 3} more
                  </Badge>
                )}
                {point.acceptedMaterials.length === 0 && (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Materials not listed
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {point.operatingHours.length
                    ? "Opening hours listed in details"
                    : "Hours not listed"}
                </p>
                {point.contact?.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {point.contact.phone}
                  </p>
                )}
              </div>
              <div className="mt-auto pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--primary)]">
                  {distance !== null
                    ? `${formatDistance(distance)} away`
                    : point.location
                      ? "Location on map"
                      : "Coordinates not listed"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPointSelect?.(point)}
                  aria-label={`View ${point.name}`}
                >
                  View details
                  <ArrowUpRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
