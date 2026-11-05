"use client";

import { format } from "date-fns";
import { Recycle } from "lucide-react";
import { Badge } from "@/components/ui";
import { ChainProgress } from "@/components/verification/ChainProgress";
import { reviewState, type ApiCollection } from "@/lib/api/collections";

/**
 * A collector's own collections: what was delivered, whether it has been reviewed,
 * and for approved ones, the proof on Stellar.
 */

const REVIEW = {
  pending: { label: "Waiting for review", variant: "warning" as const },
  approved: { label: "Approved", variant: "success" as const },
  rejected: { label: "Rejected", variant: "error" as const },
};

const NO_COLLECTIONS = "No collections yet. Deliver materials to a collection point to get started.";

export function MyCollectionList({
  collections,
  emptyMessage = NO_COLLECTIONS,
}: {
  collections: ApiCollection[];
  /** Shown when the list is empty, for example because of a filter. */
  emptyMessage?: string;
}) {
  if (collections.length === 0) {
    return (
      <div className="p-6 text-center text-[var(--muted-foreground)]">
        <Recycle className="w-10 h-10 mx-auto mb-2 opacity-50" aria-hidden="true" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {collections.map((collection) => {
        const review = REVIEW[reviewState(collection)];
        return (
          <li key={collection.id} className="py-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">
                    {collection.weight} kg {collection.materialType}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] truncate">
                    {collection.collectionPoint?.name ?? "Collection point"} ·{" "}
                    {format(new Date(collection.createdAt), "d MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                <p className="font-semibold text-[var(--primary)]">
                  {collection.paymentCurrency} {collection.paymentAmount.toFixed(2)}
                </p>
                <Badge variant={review.variant} size="sm">
                  {review.label}
                </Badge>
              </div>
            </div>
            {collection.chainStatus && (
              <div className="pl-13">
                <ChainProgress collection={collection} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
