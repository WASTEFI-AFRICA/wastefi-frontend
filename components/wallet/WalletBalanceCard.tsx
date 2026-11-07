"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Eye, EyeOff, Wallet } from "lucide-react";
import type { WasteBalance } from "@/lib/api/wallet";
import { accountExplorerUrl } from "@/lib/contracts";
import { formatWasteUnits } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/Skeleton";

interface WalletBalanceCardProps {
  wallet?: WasteBalance;
  isLoading: boolean;
  isError: boolean;
}

export function WalletBalanceCard({ wallet, isLoading, isError }: WalletBalanceCardProps) {
  const [visible, setVisible] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const amount = wallet ? formatWasteUnits(wallet.balance) : null;
  const address = wallet?.address;
  const copied = Boolean(address && copiedAddress === address);

  async function copyAddress() {
    if (!address) return;
    setCopyFailed(false);
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <section aria-labelledby="wallet-balance-title" aria-busy={isLoading}
      className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-6 text-white shadow-sm sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[32px] border-white opacity-10" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cta)]" aria-hidden="true" /> Stellar testnet
          </p>
          <h2 id="wallet-balance-title" className="text-sm text-white/85">{isError && wallet ? "Last known balance" : "WASTE balance"}</h2>
        </div>
        <Wallet className="h-6 w-6 shrink-0 text-white/70" aria-hidden="true" />
      </div>

      <div className="relative mt-2 flex items-start gap-3">
        {isLoading ? <Skeleton className="my-2 h-12 w-48 max-w-full bg-white/20" /> : (
          <p className="min-w-0 text-4xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-5xl">
            {amount === null ? "Unavailable" : visible ? amount : "••••••"}
            {amount !== null ? <span className="mt-2 block text-sm font-medium tracking-normal text-white/80">WASTE</span> : null}
          </p>
        )}
        {amount !== null ? (
          <button type="button" onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Hide balance" : "Show balance"}
            className="mt-1 shrink-0 rounded-full p-2 text-white/85 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {visible ? <Eye className="h-5 w-5" aria-hidden="true" /> : <EyeOff className="h-5 w-5" aria-hidden="true" />}
          </button>
        ) : null}
      </div>

      {isError ? (
        <p role="status" className="relative mt-4 text-sm text-white/90">
          {wallet ? "Could not refresh the balance. Showing the last successful read." : "Could not read your balance. Use Refresh wallet to try again."}
        </p>
      ) : null}

      <div className="relative mt-7 border-t border-white/20 pt-5">
        {isLoading ? <Skeleton className="h-12 w-full bg-white/20" /> : address ? (
          <>
            <p className="mb-2 text-xs font-medium text-white/80">Your Stellar address</p>
            <p className="select-all break-all font-mono text-xs leading-relaxed text-white/95">{address}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <button type="button" onClick={copyAddress} className="inline-flex items-center gap-1.5 rounded py-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <a href={accountExplorerUrl(address)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded py-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                View account<span className="sr-only"> on Stellar Expert (opens in a new tab)</span><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <p role="status" className="text-xs text-white/85">{copyFailed ? "Could not copy. Select the address above to copy it manually." : copied ? "Address copied to clipboard." : ""}</p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-white/85">
            {wallet ? "Your wallet has not been set up yet. Submit a collection to get started." : "Your address will appear here when the balance can be loaded."}
          </p>
        )}
      </div>
    </section>
  );
}
