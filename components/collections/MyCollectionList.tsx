"use client";

import { format } from "date-fns";
import { Recycle } from "lucide-react";
import { Badge } from "@/components/ui";
import { ChainProgress } from "@/components/verification/ChainProgress";
import { reviewState, type ApiCollection } from "@/lib/api/collections";
import { MaterialName } from "./MaterialName";

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
          <li key={collection.id} className="py-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold break-words">
                    <MaterialName code={collection.materialType} />
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {collection.weight} kg · {collection.collectionPoint?.name ?? "Collection point"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {format(new Date(collection.createdAt), "d MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right sm:flex-shrink-0 sm:space-y-1">
                <p className="font-semibold text-[var(--primary)]">
                  {collection.paymentCurrency} {collection.paymentAmount.toFixed(2)}
                </p>
                <Badge variant={review.variant} size="sm">
                  {review.label}
                </Badge>
              </div>
            </div>
            {collection.chainStatus && (
              <div className="sm:pl-13">
                <ChainProgress collection={collection} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
