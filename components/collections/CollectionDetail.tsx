"use client";

import { format } from "date-fns";
import { X, Package, Scale, MapPin, Camera, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { CollectionStatusBadge } from "./CollectionStatusBadge";
import { CollectionTimeline } from "./CollectionTimeline";
import type { WasteSubmission } from "@/types/api";

/**
 * Collection Detail Modal
 * Detailed view of a single collection
 */

interface CollectionDetailProps {
  collection: WasteSubmission;
  onClose: () => void;
}

export function CollectionDetail({ collection, onClose }: CollectionDetailProps) {
  // Mock timeline events
  const timelineEvents = [
    {
      status: "pending" as const,
      timestamp: collection.createdAt,
      description: "Collection submitted and awaiting verification",
    },
    ...(collection.verifiedAt
      ? [
          {
            status: collection.status === "rejected" ? ("rejected" as const) : ("verified" as const),
            timestamp: collection.verifiedAt,
            description:
              collection.status === "rejected"
                ? "Collection rejected - does not meet quality standards"
                : "Collection verified and approved for payment",
          },
        ]
      : []),
    ...(collection.status === "paid"
      ? [
          {
            status: "paid" as const,
            timestamp: new Date().toISOString(),
            description: `Payment of $${collection.actualValue?.toFixed(2) || collection.estimatedValue?.toFixed(2)} processed`,
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="w-full md:max-w-3xl bg-[var(--background)] rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-lg capitalize">
                {collection.materialType.replace("-", " ")} Collection
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                ID: {collection.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Status</span>
                <CollectionStatusBadge status={collection.status} />
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Collection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weight */}
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-[var(--muted-foreground)]" />
                  <span className="text-sm">Weight</span>
                </div>
                <span className="font-semibold">{collection.weight} kg</span>
              </div>

              {/* Material Type */}
              <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[var(--muted-foreground)]" />
                  <span className="text-sm">Material Type</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {collection.materialType.replace("-", " ")}
                </Badge>
              </div>

              {/* Estimated Value */}
              {collection.estimatedValue && (
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[var(--muted-foreground)]" />
                    <span className="text-sm">Estimated Value</span>
                  </div>
                  <span className="font-semibold text-[var(--success)]">
                    ${collection.estimatedValue.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Actual Value (if verified) */}
              {collection.actualValue && (
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[var(--success)]" />
                    <span className="text-sm font-medium">Actual Value</span>
                  </div>
                  <span className="font-bold text-lg text-[var(--success)]">
                    ${collection.actualValue.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Submission Date */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Submitted</span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {format(new Date(collection.createdAt), "MMM dd, yyyy • HH:mm")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          {collection.location && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Lat: {collection.location.lat.toFixed(6)}, Lng: {collection.location.lng.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {collection.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photos ({collection.photos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {collection.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg bg-[var(--muted)] overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`Collection photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <CollectionTimeline events={timelineEvents} currentStatus={collection.status} />
        </div>
      </div>
    </div>
  );
}
