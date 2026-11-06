"use client";

import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Badge,
  buttonVariants,
} from "@/components/ui";
import { MaterialName } from "@/components/collections/MaterialName";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import {
  calculateDistance,
  formatDistance,
  getDirectionsUrl,
} from "@/lib/utils/geolocation";

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
  const distance =
    userLocation && point.location
      ? calculateDistance(userLocation, point.location)
      : null;

  const directionsUrl = point.location
    ? getDirectionsUrl(userLocation ?? null, point.location)
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-point-name"
      className="fixed inset-0 z-[60] bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4"
    >
      <Card className="w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <h2
                  id="collection-point-name"
                  className="font-bold text-xl leading-tight break-words"
                >
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
              aria-label="Close collection point details"
              className="shrink-0 p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {point.description && (
              <p className="text-[var(--muted-foreground)]">
                {point.description}
              </p>
            )}
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Address</p>
                <p className="text-[var(--muted-foreground)] break-words">
                  {point.address}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {point.city}, {point.country}
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Operating Hours</p>
                {point.operatingHours.length ? (
                  <dl className="space-y-1 text-sm text-[var(--muted-foreground)]">
                    {point.operatingHours.map(({ day, hours }) => (
                      <div
                        key={day}
                        className="flex flex-wrap justify-between gap-x-6 gap-y-1"
                      >
                        <dt>{day}</dt>
                        <dd>{hours}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Hours not listed. Contact the collection point before
                    visiting.
                  </p>
                )}
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
                      className="text-[var(--primary)] hover:underline break-all"
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
                      className="text-[var(--primary)] hover:underline break-all"
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
                    <MaterialName code={material} />
                  </Badge>
                ))}
              </div>
              {point.acceptedMaterials.length === 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Materials not listed. Contact the collection point to check
                  what it accepts.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    fullWidth: true,
                  })}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </a>
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
