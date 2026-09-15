"use client";

import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Star,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import { calculateDistance, formatDistance, getDirectionsUrl } from "@/lib/utils/geolocation";

/**
 * Collection Point Detail
 * Detailed view of a collection point with actions
 */

interface CollectionPointDetailProps {
  point: CollectionPoint;
  userLocation?: Coordinates | null;
  onClose: () => void;
  onSelectForSubmission?: (point: CollectionPoint) => void;
}

export function CollectionPointDetail({
  point,
  userLocation,
  onClose,
  onSelectForSubmission,
}: CollectionPointDetailProps) {
  const distance = userLocation
    ? calculateDistance(userLocation, point.location)
    : null;

  const directionsUrl = userLocation
    ? getDirectionsUrl(userLocation, point.location)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
      <Card className="w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h2 className="font-bold text-xl leading-tight">
                  {point.name}
                </h2>
                {point.verified && (
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1" />
                )}
              </div>
              {distance !== null && (
                <p className="text-sm text-[var(--primary)] font-medium">
                  {formatDistance(distance)} away
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Address</p>
                <p className="text-[var(--muted-foreground)]">{point.address}</p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Operating Hours</p>
                <p className="text-[var(--muted-foreground)]">
                  {point.operatingHours.open} - {point.operatingHours.close}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {point.operatingHours.days.join(", ")}
                </p>
              </div>
            </div>

            {/* Contact */}
            {(point.contact?.phone || point.contact?.email) && (
              <div className="space-y-3">
                <p className="font-medium text-sm">Contact</p>
                {point.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--muted-foreground)]" />
                    <a
                      href={`tel:${point.contact.phone}`}
                      className="text-[var(--primary)] hover:underline"
                    >
                      {point.contact.phone}
                    </a>
                  </div>
                )}
                {point.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
                    <a
                      href={`mailto:${point.contact.email}`}
                      className="text-[var(--primary)] hover:underline"
                    >
                      {point.contact.email}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Accepted Materials */}
            <div>
              <p className="font-medium text-sm mb-3">Accepted Materials</p>
              <div className="flex flex-wrap gap-2">
                {point.acceptedMaterials.map((material) => (
                  <Badge key={material} variant="outline" size="md">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating */}
            {point.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[var(--warning)] text-[var(--warning)]" />
                <span className="font-semibold text-lg">{point.rating.toFixed(1)}</span>
                {point.totalCollections && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    ({point.totalCollections} collections)
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {directionsUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => window.open(directionsUrl, "_blank")}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
              )}
              {onSelectForSubmission && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => onSelectForSubmission(point)}
                >
                  Select for Submission
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
