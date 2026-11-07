import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { MaterialName } from "@/components/collections/MaterialName";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ReviewQueuePreview as Queue } from "@/lib/api/operator-dashboard";

export function ReviewQueuePreview({
  queue,
  isLoading,
}: {
  queue?: Queue;
  isLoading: boolean;
}) {
  return (
    <section
      aria-labelledby="dashboard-waiting-title"
      aria-busy={isLoading}
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
        <h2 id="dashboard-waiting-title" className="font-semibold">
          Oldest waiting collections
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Start with the deliveries submitted first.
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !queue ? (
        <p className="p-6 text-sm text-[var(--muted-foreground)]">
          The waiting list is unavailable. You can still open the verification
          queue.
        </p>
      ) : queue.total === 0 ? (
        <div className="px-6 py-10">
          <ClipboardCheck
            className="mb-3 h-7 w-7 text-[var(--primary)]"
            aria-hidden="true"
          />
          <h3 className="font-medium">Nothing awaiting review</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            New submissions will appear here when they are ready for review.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-[var(--border)]">
            {queue.collections.map((collection) => {
              const name = collection.collector
                ? `${collection.collector.firstName} ${collection.collector.lastName}`.trim()
                : "";
              const submitted = new Date(collection.createdAt);
              return (
                <li key={collection.id} className="px-5 py-4 sm:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                      {name || "Collector details unavailable"}
                    </p>
                    <p className="min-w-0 max-w-[45%] text-right text-sm font-medium text-[var(--primary)] [overflow-wrap:anywhere]">
                      {collection.weight.toLocaleString("en-US", {
                        maximumFractionDigits: 3,
                      })}{" "}
                      kg
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)] [overflow-wrap:anywhere]">
                    <MaterialName code={collection.materialType} /> ·{" "}
                    {collection.collectionPoint?.name ||
                      "Collection point unavailable"}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                    {Number.isNaN(submitted.getTime()) ? (
                      "Submission date unavailable"
                    ) : (
                      <>
                        Submitted{" "}
                        <time dateTime={collection.createdAt}>
                          {submitted.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--muted-foreground)] sm:px-6">
            Showing {queue.collections.length} of{" "}
            {queue.total.toLocaleString("en-US")} waiting collections
          </p>
        </>
      )}
      <div className="border-t border-[var(--border)] px-5 py-4 sm:px-6">
        <Link
          href="/verify"
          className="inline-flex items-center gap-2 rounded text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          View verification queue
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
