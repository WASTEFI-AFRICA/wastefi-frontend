import { MaterialName } from "@/components/collections/MaterialName";
import { Skeleton } from "@/components/ui/Skeleton";
import type { MaterialStatistic } from "@/lib/api/operator-dashboard";

export function MaterialBreakdown({
  materials,
  isLoading,
}: {
  materials?: MaterialStatistic[];
  isLoading: boolean;
}) {
  const rows = materials
    ? [...materials].sort(
        (a, b) =>
          b.totalWeight - a.totalWeight ||
          a.materialType.localeCompare(b.materialType),
      )
    : [];
  const maxWeight = rows.reduce(
    (max, row) => Math.max(max, row.totalWeight),
    0,
  );

  return (
    <section
      aria-labelledby="dashboard-materials-title"
      aria-busy={isLoading}
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
        <h2 id="dashboard-materials-title" className="font-semibold">
          Materials recorded
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Weight and collection count for each material.
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !materials ? (
        <p className="p-6 text-sm text-[var(--muted-foreground)]">
          Material statistics are unavailable. Use Refresh dashboard to try
          again.
        </p>
      ) : rows.length === 0 ? (
        <div className="px-6 py-10">
          <h3 className="font-medium">No collections recorded yet</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            The material breakdown will appear when collectors submit
            deliveries.
          </p>
        </div>
      ) : (
        <div className="px-5 pb-3 sm:px-6">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">
              All recorded collections and weight by material, largest weight
              first
            </caption>
            <colgroup>
              <col className="w-[54%]" />
              <col className="w-[23%]" />
              <col className="w-[23%]" />
            </colgroup>
            <thead>
              <tr className="text-xs text-[var(--muted-foreground)]">
                <th scope="col" className="py-4 pr-3 text-left font-medium">
                  Material
                </th>
                <th scope="col" className="py-4 pl-2 text-right font-medium">
                  Collections
                </th>
                <th scope="col" className="py-4 pl-2 text-right font-medium">
                  Weight (kg)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.map((row) => (
                <tr key={row.materialType}>
                  <th
                    scope="row"
                    className="py-4 pr-4 text-left font-medium [overflow-wrap:anywhere]"
                  >
                    <MaterialName code={row.materialType} />
                    <div
                      aria-hidden="true"
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--accent)]"
                    >
                      <div
                        className="h-full rounded-full bg-[var(--primary)]"
                        style={{
                          width: `${maxWeight > 0 ? (row.totalWeight / maxWeight) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </th>
                  <td className="py-4 pl-2 text-right align-top [overflow-wrap:anywhere]">
                    {row.count.toLocaleString("en-US")}
                  </td>
                  <td className="py-4 pl-2 text-right align-top font-medium [overflow-wrap:anywhere]">
                    {row.totalWeight.toLocaleString("en-US", {
                      maximumFractionDigits: 3,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
