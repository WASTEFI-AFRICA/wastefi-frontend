"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui";
import { txExplorerUrl } from "@/lib/contracts";
import { wasteAmount, type ApiCollection, type ChainStatus } from "@/lib/api/collections";

/**
 * Where an approved collection is on Stellar, with links to each transaction.
 */

const STATUS: Record<ChainStatus, { label: string; variant: "warning" | "primary" | "success" | "error" }> = {
  PENDING: { label: "Queued for Stellar", variant: "warning" },
  RECORDED: { label: "Recorded on Stellar", variant: "primary" },
  VERIFIED: { label: "Verified on Stellar", variant: "primary" },
  PAID: { label: "Paid on Stellar", variant: "success" },
  FAILED: { label: "Retrying on Stellar", variant: "error" },
};

/** True when nothing more will happen on-chain: not queued, or already paid. */
export function isChainSettled(status: ChainStatus | null): boolean {
  return status === null || status === "PAID";
}

export function ChainProgress({ collection }: { collection: ApiCollection }) {
  if (!collection.chainStatus) return null;

  const status = STATUS[collection.chainStatus];
  const minted = collection.chainStatus === "PAID" ? wasteAmount(collection.chainAmount) : null;
  const links = [
    { label: "Record", hash: collection.chainRecordTxHash },
    { label: "Verify", hash: collection.chainVerifyTxHash },
    { label: "Payment", hash: collection.chainPaymentTxHash },
  ].filter((link): link is { label: string; hash: string } => Boolean(link.hash));

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={status.variant} size="sm">
          {status.label}
        </Badge>
        {minted !== null && (
          <span className="text-sm font-medium">{minted.toLocaleString()} WASTE minted</span>
        )}
      </div>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={txExplorerUrl(link.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--primary)] underline underline-offset-4"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
              <span className="sr-only">transaction on stellar.expert (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
