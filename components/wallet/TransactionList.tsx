"use client";

import Link from "next/link";
import { ArrowDownLeft, ExternalLink, Leaf } from "lucide-react";
import { MaterialName } from "@/components/collections/MaterialName";
import { buttonVariants } from "@/components/ui/Button";
import type { ApiCollection } from "@/lib/api/collections";
import { txExplorerUrl } from "@/lib/contracts";
import { formatWasteUnits } from "@/lib/wallet";

/** Collection rewards only. This is not a ledger of transfers or cash withdrawals. */
export function TransactionList({ collections }: { collections: ApiCollection[] }) {
  if (collections.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]"><Leaf className="h-6 w-6" aria-hidden="true" /></div>
        <h3 className="font-semibold">Your first reward starts with a collection</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">Rewards appear here after an approved collection completes its on-chain payment.</p>
        <Link href="/submit" className={buttonVariants({ size: "sm", className: "mt-5" })}>Submit a collection</Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--border)]">
      {collections.map((collection) => {
        const amount = formatWasteUnits(collection.chainAmount);
        const submitted = new Date(collection.createdAt);
        const validDate = !Number.isNaN(submitted.getTime());
        return (
          <li key={collection.id} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-5 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]"><ArrowDownLeft className="h-5 w-5" aria-hidden="true" /></div>
            <div className="min-w-0">
              <p className="font-medium [overflow-wrap:anywhere]"><MaterialName code={collection.materialType} /></p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">{collection.weight.toLocaleString("en-US")} kg{collection.collectionPoint ? ` · ${collection.collectionPoint.name}` : ""}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Submitted {validDate ? <time dateTime={collection.createdAt}>{submitted.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time> : "date unavailable"}
              </p>
            </div>
            <div className="col-start-2 min-w-0 sm:col-start-auto sm:text-right">
              <p className="font-semibold text-[var(--primary)] [overflow-wrap:anywhere]">{amount === null ? "Amount unavailable" : `+${amount} WASTE`}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">Minted</p>
              {collection.chainPaymentTxHash ? (
                <a href={txExplorerUrl(collection.chainPaymentTxHash)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 rounded text-xs font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
                  View payment<span className="sr-only"> for collection {collection.id} on Stellar Expert (opens in a new tab)</span><ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : <p className="mt-2 text-xs text-[var(--muted-foreground)]">Payment link unavailable</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
