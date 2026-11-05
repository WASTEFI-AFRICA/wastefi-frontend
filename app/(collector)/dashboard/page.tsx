"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  buttonVariants,
} from "@/components/ui";
import { DashboardSkeleton } from "@/components/skeletons";
import { MyCollectionList } from "@/components/collections";
import { isChainSettled } from "@/components/verification";
import { usePollWhile } from "@/lib/hooks/usePollWhile";
import { useAuthStore } from "@/store/authStore";
import {
  listMyCollections,
  reviewState,
  wasteAmount,
  type ApiCollection,
} from "@/lib/api/collections";
import { getWasteBalance, type WasteBalance } from "@/lib/api/wallet";
import { Coins, ExternalLink, Recycle, Scale, Plus } from "lucide-react";

/**
 * Collector Dashboard
 * The collector's WASTE balance, read from the token contract on Stellar, their
 * collection totals, and their latest collections with the on-chain proof.
 */

const POLL_MS = 5000;

export default function CollectorDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [collections, setCollections] = useState<ApiCollection[] | null>(null);
  const [balance, setBalance] = useState<WasteBalance | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Every state update happens when the requests settle, so this can run from effects.
  const load = useCallback(
    () =>
      Promise.allSettled([listMyCollections(50), getWasteBalance()]).then(([mine, wallet]) => {
        if (mine.status === "fulfilled") {
          setCollections(mine.value);
          setLoadError(null);
        } else {
          setLoadError("Could not load your collections. Pull to refresh or try again shortly.");
          setCollections((current) => current ?? []);
        }
        if (wallet.status === "fulfilled") {
          setBalance(wallet.value);
          setBalanceError(null);
        } else {
          setBalanceError("Balance unavailable right now");
        }
      }),
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  // While an approved collection is still on its way to being paid, keep checking.
  const settling = (collections ?? []).some(
    (c) => reviewState(c) === "approved" && !isChainSettled(c.chainStatus)
  );
  usePollWhile(settling, load, POLL_MS);

  const totals = useMemo(() => {
    const list = collections ?? [];
    const approved = list.filter((c) => reviewState(c) === "approved");
    return {
      approved: approved.length,
      pending: list.filter((c) => reviewState(c) === "pending").length,
      weightKg: Math.round(approved.reduce((sum, c) => sum + c.weight, 0) * 10) / 10,
    };
  }, [collections]);

  if (collections === null) {
    return <DashboardSkeleton />;
  }

  const firstName = user?.name.split(" ")[0];
  const waste = balance ? wasteAmount(balance.balance) ?? 0 : null;

  return (
    <div className="animate-fade-in">
      <Container>
        <Section>
          <PageHeader
            title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
            description="Your collections and what they have earned on Stellar"
            actions={
              <Link href="/submit" className={buttonVariants({ size: "lg", className: "hidden sm:flex" })}>
                <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                New Submission
              </Link>
            }
          />
        </Section>

        <Section spacing="sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* WASTE balance, read from the token contract */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                  WASTE balance
                </CardTitle>
                <Coins className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--primary)]">
                  {waste !== null ? `${waste.toLocaleString()} WASTE` : "..."}
                </div>
                {balanceError ? (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{balanceError}</p>
                ) : balance?.explorerUrl ? (
                  <a
                    href={balance.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--primary)] underline underline-offset-4 mt-1 inline-flex items-center gap-1"
                  >
                    Your wallet on Stellar testnet
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Your Stellar wallet is created with your first approved collection
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                  Collections
                </CardTitle>
                <Recycle className="w-5 h-5 text-[var(--info)]" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.approved} approved</div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {totals.pending} waiting for review
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                  Recycled
                </CardTitle>
                <Scale className="w-5 h-5 text-[var(--success)]" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--success)]">{totals.weightKg} kg</div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  In approved collections
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section spacing="sm">
          <Card>
            <CardHeader>
              <CardTitle>Recent Collections</CardTitle>
              <CardDescription>
                Approved collections are recorded on Stellar and paid in WASTE
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadError && (
                <p role="alert" className="text-sm text-[var(--error)] mb-3">
                  {loadError}
                </p>
              )}
              <MyCollectionList collections={collections.slice(0, 5)} />
              {collections.length > 5 && (
                <Link
                  href="/collections"
                  className={buttonVariants({ variant: "outline", fullWidth: true, className: "mt-4" })}
                >
                  View All Collections
                </Link>
              )}
            </CardContent>
          </Card>
        </Section>

        {/* Quick Actions - Mobile FAB alternative */}
        <div className="fixed bottom-20 right-4 sm:hidden">
          <Link
            href="/submit"
            aria-label="Submit a collection"
            className={buttonVariants({ variant: "cta", size: "lg", className: "rounded-full shadow-lg" })}
          >
            <Plus className="w-6 h-6" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
