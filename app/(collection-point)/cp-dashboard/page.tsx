"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck, Globe2, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { DashboardMetrics } from "@/components/collection-point/DashboardMetrics";
import { MaterialBreakdown } from "@/components/collection-point/MaterialBreakdown";
import { ReviewQueuePreview } from "@/components/collection-point/ReviewQueuePreview";
import { APIError } from "@/lib/api/client";
import {
  getCollectionStatistics,
  getReviewQueuePreview,
} from "@/lib/api/operator-dashboard";
import { useAuthStore } from "@/store/authStore";
import { collectionAccessMessage } from "@/lib/api/collection-scope";

const queryOptions = {
  staleTime: 0,
  gcTime: 0,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

export default function CollectionPointDashboard() {
  const userId = useAuthStore((state) => state.user?.id);
  const statistics = useQuery({
    ...queryOptions,
    queryKey: ["operator-dashboard", userId, "statistics"],
    queryFn: ({ signal }) => getCollectionStatistics(signal),
    enabled: Boolean(userId),
  });
  const queue = useQuery({
    ...queryOptions,
    queryKey: ["operator-dashboard", userId, "queue"],
    queryFn: ({ signal }) => getReviewQueuePreview(signal),
    enabled: Boolean(userId),
  });
  const refreshing = statistics.isFetching || queue.isFetching;
  const scope = queue.data?.scope ?? statistics.data?.scope;
  const accessError =
    collectionAccessMessage(statistics.error) ||
    collectionAccessMessage(queue.error);
  const scopeMismatch =
    statistics.data &&
    queue.data &&
    (statistics.data.scope.mode !== queue.data.scope.mode ||
      statistics.data.scope.point?.id !== queue.data.scope.point?.id);

  if (accessError || scopeMismatch)
    return (
      <Container>
        <div className="space-y-6 py-6 sm:py-8">
          <PageHeader
            title="Collection dashboard"
            description="Your collection point activity."
          />
          <div
            role="alert"
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <h2 className="font-semibold">
              {accessError
                ? "Collection point access"
                : "Assignment changed while loading"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {accessError ||
                "Refresh the dashboard to load one consistent collection point."}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              disabled={refreshing}
              onClick={() => {
                void statistics.refetch();
                void queue.refetch();
              }}
            >
              {refreshing ? "Refreshing…" : "Refresh dashboard"}
            </Button>
          </div>
        </div>
      </Container>
    );

  return (
    <Container>
      <div className="space-y-6 py-6 sm:py-8">
        <PageHeader
          title="Collection dashboard"
          description={
            scope?.mode === "assigned_point"
              ? "Recorded activity and deliveries at your assigned point."
              : "Recorded activity and deliveries awaiting review."
          }
          actions={
            <Button
              variant="outline"
              size="sm"
              disabled={refreshing}
              onClick={() => {
                void statistics.refetch();
                void queue.refetch();
              }}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin motion-reduce:animate-none" : ""}`}
                aria-hidden="true"
              />
              {refreshing ? "Refreshing…" : "Refresh dashboard"}
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 [overflow-wrap:anywhere]">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            {scope?.mode === "assigned_point"
              ? `Assigned point: ${scope.point.name}`
              : scope?.mode === "platform"
                ? "All collection points"
                : "Scope unavailable"}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5">
            All time
          </span>
        </div>

        <section
          aria-labelledby="dashboard-queue-title"
          aria-busy={queue.isPending}
          className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] p-6 text-white sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border-[32px] border-white opacity-10"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/85">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                <h2 id="dashboard-queue-title">
                  {queue.isError && queue.data
                    ? "Last loaded review queue"
                    : "Awaiting review"}
                </h2>
              </div>
              {queue.isPending ? (
                <Skeleton className="my-3 h-12 w-32 bg-white/20" />
              ) : (
                <p className="text-4xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-5xl">
                  {queue.data
                    ? queue.data.total.toLocaleString("en-US")
                    : "Unavailable"}
                </p>
              )}
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85">
                {queue.data?.total === 0
                  ? "The review queue is clear. New submissions will appear here."
                  : "Review submitted deliveries so approved collections can continue to payment."}
              </p>
              {queue.isError ? (
                <p
                  role="status"
                  className="mt-3 max-w-xl text-sm text-white/95"
                >
                  {queue.data
                    ? "Could not refresh the queue. Showing the last successful snapshot."
                    : "The queue could not be loaded. Use Refresh dashboard or open the verification queue."}
                </p>
              ) : null}
            </div>
            <Link
              href="/verify"
              className={buttonVariants({
                variant: "cta",
                className: "relative shrink-0 gap-2",
              })}
            >
              Open verification queue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="dashboard-recorded-title"
          className="space-y-4"
        >
          <div>
            <h2 id="dashboard-recorded-title" className="font-semibold">
              Recorded collections
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              These figures include collections at every review stage, including
              rejected deliveries.
            </p>
          </div>
          {statistics.isError ? (
            <p
              role="status"
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-sm"
            >
              {statistics.data
                ? "Could not refresh statistics. Showing the last loaded totals and material breakdown."
                : statistics.error instanceof APIError &&
                    statistics.error.status === 403
                  ? "Statistics are not available for this account. You can still use the verification queue."
                  : "Statistics could not be loaded. Use Refresh dashboard to try again."}
            </p>
          ) : null}
          <DashboardMetrics
            statistics={statistics.data}
            isLoading={statistics.isPending}
          />
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <MaterialBreakdown
            materials={statistics.data?.byMaterial}
            isLoading={statistics.isPending}
          />
          <ReviewQueuePreview queue={queue.data} isLoading={queue.isPending} />
        </div>
      </div>
    </Container>
  );
}
