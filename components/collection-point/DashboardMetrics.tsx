import { Layers, Package, Scale } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CollectionStatistics } from "@/lib/api/operator-dashboard";

export function DashboardMetrics({
  statistics,
  isLoading,
}: {
  statistics?: CollectionStatistics;
  isLoading: boolean;
}) {
  const metrics = [
    {
      title: "Collections recorded",
      value: statistics?.totalCollections.toLocaleString("en-US"),
      detail: "Every review stage",
      icon: Package,
    },
    {
      title: "Recorded weight",
      value: statistics
        ? `${statistics.totalWeight.toLocaleString("en-US", { maximumFractionDigits: 3 })} kg`
        : undefined,
      detail: "Across all recorded collections",
      icon: Scale,
    },
    {
      title: "Materials recorded",
      value: statistics?.byMaterial.length.toLocaleString("en-US"),
      detail: "Distinct material types",
      icon: Layers,
    },
  ];

  return (
    <dl
      aria-label="Recorded collection statistics"
      aria-busy={isLoading}
      className="grid gap-4 sm:grid-cols-3"
    >
      {metrics.map(({ title, value, detail, icon: Icon }) => (
        <div
          key={title}
          className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"
        >
          <dt className="flex items-start justify-between gap-3">
            <span className="min-w-0 text-sm text-[var(--muted-foreground)]">
              {title}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </dt>
          <dd className="mt-3">
            <div className="text-2xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-3xl">
              {isLoading ? (
                <>
                  <Skeleton className="h-9 w-28 max-w-full" />
                  <span className="sr-only">Loading</span>
                </>
              ) : (
                (value ?? "Unavailable")
              )}
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              {detail}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
