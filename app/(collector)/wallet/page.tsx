"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight, Info, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { TransactionList } from "@/components/wallet/TransactionList";
import { WalletSkeleton } from "@/components/skeletons/WalletSkeleton";
import { getWasteBalance, listWalletCollections } from "@/lib/api/wallet";
import { formatWasteUnits, sumWasteUnits } from "@/lib/wallet";
import { useAuthStore } from "@/store/authStore";

const queryOptions = {
  retry: false,
  staleTime: 0,
  gcTime: 0,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

export default function WalletPage() {
  const userId = useAuthStore((state) => state.user?.id);
  const balance = useQuery({
    ...queryOptions,
    queryKey: ["wallet", userId, "balance"],
    queryFn: ({ signal }) => getWasteBalance(signal),
    enabled: Boolean(userId),
  });
  const history = useQuery({
    ...queryOptions,
    queryKey: ["wallet", userId, "collections"],
    queryFn: ({ signal }) => listWalletCollections(signal),
    enabled: Boolean(userId),
  });
  const rewards = useMemo(() => history.data?.filter((collection) => collection.chainStatus === "PAID") ?? [], [history.data]);
  const totalEarned = formatWasteUnits(sumWasteUnits(rewards));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rewards.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const refreshing = balance.isFetching || history.isFetching;

  if (balance.isPending && history.isPending) return <WalletSkeleton />;

  return (
    <Container>
      <div className="space-y-6 py-6">
        <PageHeader title="Wallet" description="Your WASTE balance and collection rewards."
          actions={<Button variant="outline" size="sm" disabled={refreshing} onClick={() => { void balance.refetch(); void history.refetch(); }}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden="true" />
            {refreshing ? "Refreshing…" : "Refresh wallet"}
          </Button>} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <WalletBalanceCard wallet={balance.data} isLoading={balance.isPending} isError={balance.isError} />
          <section aria-labelledby="reward-summary-title" aria-busy={history.isPending} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h2 id="reward-summary-title" className="font-semibold">Collection rewards</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Completed on-chain payments</p>
            {history.isPending ? <Skeleton className="my-6 h-24 w-full" /> : history.data ? (
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-xs text-[var(--muted-foreground)]">{history.isError ? "Last loaded rewards" : "Rewards recorded"}</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">{totalEarned === null ? "Amount unavailable" : <>{totalEarned} <span className="text-sm font-medium text-[var(--muted-foreground)]">WASTE</span></>}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--border)] pt-4">
                  <dt className="text-sm text-[var(--muted-foreground)]">Paid collections</dt>
                  <dd className="text-xl font-semibold">{rewards.length.toLocaleString("en-US")}</dd>
                </div>
              </dl>
            ) : <p className="mt-6 text-sm text-[var(--muted-foreground)]">Reward totals are unavailable while history cannot be loaded.</p>}
            <Link href="/collections" className="mt-6 inline-flex items-center gap-2 rounded text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
              View all collections<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 px-5 py-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
          <p>WASTE is a token on Stellar testnet. It has no cash value here, and cash-out is not available. The balance comes from the token contract; reward history shows completed collection payments recorded by WasteFi.</p>
        </div>

        <section aria-labelledby="reward-history-title" aria-busy={history.isFetching} className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <h2 id="reward-history-title" className="font-semibold">Reward history</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Minted WASTE from your collections. Pending approvals are in <Link href="/collections" className="text-[var(--primary)] underline underline-offset-4">My Collections</Link>.</p>
          </div>
          {history.isError ? <p role="status" className="border-b border-[var(--border)] bg-[var(--warning)]/10 px-5 py-4 text-sm sm:px-6">
            {history.data ? "Could not refresh all collection pages. Showing the last successfully loaded history and totals." : "Could not load all collection pages. History and totals are unavailable. Use Refresh wallet to try again."}
          </p> : null}
          {history.isPending ? <div className="space-y-3 p-6"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div> : history.data ? (
            <TransactionList collections={rewards.slice((currentPage - 1) * pageSize, currentPage * pageSize)} />
          ) : null}
          {history.data && pageCount > 1 ? <nav aria-label="Reward history pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-4 sm:px-6">
            <p className="text-sm text-[var(--muted-foreground)]" aria-live="polite">Page {currentPage} of {pageCount}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />Previous</Button>
              <Button size="sm" variant="outline" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Button>
            </div>
          </nav> : null}
        </section>
      </div>
    </Container>
  );
}
