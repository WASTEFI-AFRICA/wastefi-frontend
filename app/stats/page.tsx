"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Recycle, RefreshCw, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from "@/components/ui";
import {
  API_ORIGIN,
  HEALTH_URL,
  PUBLIC_STATS_URL,
  fetchCollectionPoints,
  fetchHealth,
  fetchPublicStats,
  type HealthStatus,
  type PublicCollectionPoint,
  type PublicStats,
} from "@/lib/api/public";
import {
  CONTRACT_BUNDLE_UPDATED_ON,
  CONTRACT_DEPLOYER,
  CONTRACT_NETWORK,
  DEPLOYED_CONTRACTS,
  accountExplorerUrl,
  contractExplorerUrl,
  txExplorerUrl,
} from "@/lib/contracts";

/**
 * Public stats
 *
 * Readable without an account, so anyone evaluating WasteFi can see what actually
 * runs. Every figure is fetched live from the deployed API when the page opens
 * and every 30 seconds after; nothing here is mock data. The "What is live" list at
 * the bottom is maintained by hand: update it when a screen moves onto the API.
 */

const REFRESH_MS = 30_000;

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86_400)} d ago`;
}

function StatCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: string;
  hint?: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
        {loading ? (
          <Skeleton className="h-9 w-24 mt-2" />
        ) : (
          <p className="text-3xl font-bold mt-1 text-[var(--primary)]">{value}</p>
        )}
        {hint && <p className="text-xs text-[var(--muted-foreground)] mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function PublicStatsPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [points, setPoints] = useState<PublicCollectionPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const [nextStats, nextHealth, nextPoints] = await Promise.all([
        fetchPublicStats(signal),
        fetchHealth(signal),
        fetchCollectionPoints(signal),
      ]);
      setStats(nextStats);
      setHealth(nextHealth);
      setPoints(nextPoints);
      setError(null);
      setLastLoaded(new Date());
    } catch (caught) {
      if ((caught as Error).name === "AbortError") return;
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    const timer = setInterval(() => void load(controller.signal), REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [load]);

  const apiUp = !error && health?.status === "ok";
  const dbUp = health?.database === "connected";
  const maxWeight = Math.max(1, ...(stats?.byMaterial.map((m) => m.weightKg) ?? [1]));
  const wasteToken = DEPLOYED_CONTRACTS.find((c) => c.key === "waste_token");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="bg-[var(--primary)] text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Recycle className="w-6 h-6" aria-hidden="true" />
            WasteFi
          </Link>
          <Link href="/login" className="text-sm underline underline-offset-4">
            Sign in
          </Link>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-10 pt-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Live platform stats</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            Live numbers from the running WasteFi system. No account needed. Everything
            below is read from the deployed API when this page opens, and the contracts are
            linked on-chain.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Status strip */}
        <section aria-label="System status" className="flex flex-wrap items-center gap-3">
          {[
            { label: "API", ok: apiUp },
            { label: "Database", ok: dbUp },
          ].map(({ label, ok }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                loading
                  ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  : ok
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {ok ? (
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <XCircle className="w-4 h-4" aria-hidden="true" />
              )}
              {label}: {loading ? "checking" : ok ? "connected" : "unreachable"}
            </span>
          ))}
          <span className="text-sm text-[var(--muted-foreground)]">
            {lastLoaded ? `Updated ${lastLoaded.toLocaleTimeString()}` : "Loading..."}
          </span>
          <Button variant="outline" size="sm" onClick={() => void load()} className="ml-auto">
            <RefreshCw className="w-4 h-4 mr-1.5" aria-hidden="true" /> Refresh
          </Button>
        </section>

        {error && (
          <Card>
            <CardContent className="p-5">
              <p className="font-semibold text-red-700">The API could not be reached.</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Tried <code>{API_ORIGIN}</code>. The service may be starting up; try again in a
                few seconds. Details: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Headline numbers */}
        <section aria-label="Platform totals">
          <h2 className="text-xl font-semibold mb-3">Impact so far</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Weight and value count verified collections only: a delivery counts once an
            administrator or collection point has confirmed it.
          </p>
          <div
            role="note"
            className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800"
          >
            <strong>Demo deployment.</strong> WasteFi has no field users yet. The collections
            here come from a demo collector account and from people trying the demo. Nothing
            is created already verified: every verified collection was approved through the
            app and recorded on Stellar testnet, and its payment is linked below.
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              loading={loading && !stats}
              label="Verified collections"
              value={stats ? whole.format(stats.totals.collectionsVerified) : "-"}
              hint={stats ? `${whole.format(stats.totals.collectionsRecorded)} recorded in total` : undefined}
            />
            <StatCard
              loading={loading && !stats}
              label="Waste verified"
              value={stats ? `${number.format(stats.totals.verifiedWeightKg)} kg` : "-"}
            />
            <StatCard
              loading={loading && !stats}
              label="Payouts earned"
              value={stats ? `${stats.currency} ${number.format(stats.totals.verifiedValue)}` : "-"}
              hint="Value of verified collections"
            />
            <StatCard
              loading={loading && !stats}
              label="Active collectors"
              value={stats ? whole.format(stats.totals.activeCollectors) : "-"}
            />
            <StatCard
              loading={loading && !stats}
              label="Collection points"
              value={stats ? whole.format(stats.totals.activeCollectionPoints) : "-"}
            />
          </div>
        </section>

        {/* On-chain record */}
        <section aria-label="On Stellar">
          <h2 className="text-xl font-semibold mb-3">On Stellar</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Each approved collection is recorded and verified in the WasteFi contracts, and the
            collector is paid in WASTE, a token minted by the payment contract. These numbers
            come from the API&apos;s record of those transactions; every one can be checked on
            stellar.expert.
          </p>
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">New collection verification</p>
            <p className="mt-1 font-semibold">
              {stats?.onChain?.verificationFlow === "point_owner_v1"
                ? "Signed by the collection point"
                : stats?.onChain?.verificationFlow === "admin_v1"
                  ? "Signed by the platform admin"
                  : stats?.onChain?.verificationFlow === null
                    ? "On-chain recording is disabled"
                    : "Waiting for the API to report its verification mode"}
            </p>
            <p className="mt-2 leading-relaxed">
              Wallets are custodial: the API holds the signing keys. The platform controls registry
              verification and payments, and the contracts retain an admin verification override.
              Older collections keep their original contracts and verification flow.
            </p>
            {stats?.onChain?.payoutMode === "derived_v1" && (
              <p className="mt-2 leading-relaxed">
                <strong>Payouts are read on-chain.</strong> The payment contract takes the collector
                and the amount from the verified transaction, so the platform does not choose
                them. The admin override that can pay another amount stays in the contract, and
                every use of it is logged as an event.
              </p>
            )}
            {stats?.onChain?.payoutMode === "caller_amount_v1" && (
              <p className="mt-2 leading-relaxed">
                <strong>Payout amounts are passed in by the platform.</strong> The payment contract
                does not yet read them from the verified transaction.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              loading={loading && !stats}
              label="Collections paid on-chain"
              value={stats?.onChain ? whole.format(stats.onChain.collectionsPaid) : "-"}
            />
            <StatCard
              loading={loading && !stats}
              label="WASTE minted to collectors"
              value={stats?.onChain ? number.format(stats.onChain.wasteMinted) : "-"}
              hint="Counts payouts made through the app only. The token's total supply also includes test mints."
            />
            {wasteToken && (
              <Card className="col-span-2 lg:col-span-1">
                <CardContent className="p-5">
                  <p className="text-sm text-[var(--muted-foreground)]">WASTE token contract</p>
                  <a
                    href={contractExplorerUrl(wasteToken.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 font-mono text-sm text-[var(--primary)] underline underline-offset-4"
                  >
                    {shortAddress(wasteToken.address)}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{CONTRACT_NETWORK}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Materials */}
        <section aria-label="Materials collected">
          <Card>
            <CardHeader>
              <CardTitle>Verified weight by material</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.byMaterial.length > 0 ? (
                <ul className="space-y-3">
                  {stats.byMaterial.map((item) => (
                    <li key={item.materialType}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.materialType}</span>
                        <span className="text-[var(--muted-foreground)]">
                          {number.format(item.weightKg)} kg &middot; {item.collections} collection
                          {item.collections === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[var(--muted)]" aria-hidden="true">
                        <div
                          className="h-2.5 rounded-full bg-[var(--primary)]"
                          style={{ width: `${Math.max(3, (item.weightKg / maxWeight) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {loading ? "Loading..." : "No verified collections yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent activity + collection points */}
        <section className="grid md:grid-cols-2 gap-4" aria-label="Recent activity">
          <Card>
            <CardHeader>
              <CardTitle>Latest verified collections</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.recentVerified.length > 0 ? (
                <ul className="divide-y divide-[var(--border)]">
                  {stats.recentVerified.map((item, index) => (
                    <li key={index} className="py-2.5 flex justify-between gap-3 text-sm">
                      <span>
                        <span className="font-medium">{number.format(item.weightKg)} kg</span>{" "}
                        {item.materialType}
                        {item.onChainTxHash ? (
                          <a
                            href={txExplorerUrl(item.onChainTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-[var(--primary)] underline underline-offset-4"
                          >
                            paid on Stellar
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="ml-2 text-[var(--muted-foreground)]">payment pending</span>
                        )}
                      </span>
                      <span className="text-[var(--muted-foreground)] text-right">
                        {item.city} &middot; {timeAgo(item.verifiedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {loading ? "Loading..." : "Nothing verified yet."}
                </p>
              )}
              <p className="text-xs text-[var(--muted-foreground)] mt-3">
                Collector names and phone numbers are never shown.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collection points</CardTitle>
            </CardHeader>
            <CardContent>
              {points.length > 0 ? (
                <ul className="divide-y divide-[var(--border)]">
                  {points.map((point) => (
                    <li key={point.id} className="py-2.5 text-sm">
                      <p className="font-medium">{point.name}</p>
                      <p className="text-[var(--muted-foreground)]">
                        {point.address}, {point.city}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {loading ? "Loading..." : "No collection points yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Smart contracts */}
        <section aria-label="Smart contracts">
          <h2 className="text-xl font-semibold mb-1">Smart contracts on-chain</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Seven Soroban contracts on {CONTRACT_NETWORK}. Bundle updated {CONTRACT_BUNDLE_UPDATED_ON} by{" "}
            <a
              className="text-[var(--primary)] underline"
              href={accountExplorerUrl(CONTRACT_DEPLOYER)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortAddress(CONTRACT_DEPLOYER)}
            </a>
            . Open any of them in the explorer to see the live ledger entries and transactions.
            Testnet, so no real funds; the contracts have not been audited.
            The token, collector registry, pricing and reputation contracts were retained from the October deployment.
          </p>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-[var(--border)]">
                {DEPLOYED_CONTRACTS.map((contract) => (
                  <li
                    key={contract.key}
                    className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <div>
                      <p className="font-medium">{contract.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{contract.purpose}</p>
                    </div>
                    <a
                      href={contractExplorerUrl(contract.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[var(--primary)] underline underline-offset-2 font-mono"
                    >
                      {shortAddress(contract.address)}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="sr-only">(opens the Stellar explorer)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Honest scope */}
        <section aria-label="What is live and what is not">
          <Card>
            <CardHeader>
              <CardTitle>What is live, and what is not</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-2">Live and verifiable</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    The backend API:{" "}
                    <a className="text-[var(--primary)] underline" href={HEALTH_URL} target="_blank" rel="noopener noreferrer">
                      health
                    </a>
                    ,{" "}
                    <a className="text-[var(--primary)] underline" href={PUBLIC_STATS_URL} target="_blank" rel="noopener noreferrer">
                      the raw stats JSON this page reads
                    </a>
                  </li>
                  <li>
                    Sign-up and sign-in, submitting a collection, and the collection point&apos;s
                    verification queue
                  </li>
                  <li>
                    Approving a collection records it, verifies it and pays the collector in WASTE
                    on Stellar testnet. Each collection&apos;s transaction links identify the
                    contracts used, including older pinned work
                  </li>
                  <li>
                    The collector&apos;s dashboard and history, with the WASTE balance read from the
                    token contract and a link to every transaction
                  </li>
                  <li>Wallet payment history, profile editing, collection point dashboard totals, and admin account activation and point assignments</li>
                  <li>
                    Automated test suites for the contracts and the backend, run on every push (see the{" "}
                    <a
                      className="text-[var(--primary)] underline"
                      href="https://github.com/WASTEFI-AFRICA/wastefi-backend/actions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CI runs
                    </a>
                    )
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-700 mb-2">Not connected yet</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    Some screens still show <strong>sample data</strong>: achievements, the
                    collection point&apos;s analytics and inventory, and other admin screens.
                    Each one says so.
                  </li>
                  <li>Photo upload when submitting a collection</li>
                  <li>Mobile-money cash-out (M-Pesa, MTN, Airtel) and SMS phone verification</li>
                  <li>
                    On this demo, new accounts are active at once instead of being verified first,
                    and collector wallets are custodial testnet wallets
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted-foreground)]">
        WasteFi &middot;{" "}
        <a
          className="underline"
          href="https://github.com/WASTEFI-AFRICA"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </footer>
    </div>
  );
}
