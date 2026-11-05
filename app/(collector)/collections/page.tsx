"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui";
import { CollectionsSkeleton } from "@/components/skeletons";
import { MyCollectionList } from "@/components/collections";
import { isChainSettled } from "@/components/verification";
import { usePollWhile } from "@/lib/hooks/usePollWhile";
import {
  listMyCollections,
  reviewState,
  type ApiCollection,
  type ReviewState,
} from "@/lib/api/collections";

/**
 * Collection History
 * Every collection the signed-in collector has submitted, from the API. Approved
 * ones show their record, verification and payment on Stellar.
 */

const POLL_MS = 5000;

const FILTERS: Array<{ value: ReviewState | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Waiting" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<ApiCollection[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewState | "all">("all");

  // Every state update happens when the request settles, so this can run from effects.
  const load = useCallback(
    () =>
      listMyCollections(100)
        .then((mine) => {
          setCollections(mine);
          setLoadError(null);
        })
        .catch(() => {
          setLoadError("Could not load your collections. Please try again shortly.");
          setCollections((current) => current ?? []);
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

  const shown = useMemo(
    () =>
      (collections ?? []).filter((c) => filter === "all" || reviewState(c) === filter),
    [collections, filter]
  );

  if (collections === null) {
    return <CollectionsSkeleton />;
  }

  return (
    <Container>
      <Section>
        <PageHeader
          title="My Collections"
          description="Everything you have delivered, and its proof on Stellar"
        />
      </Section>

      <Section spacing="sm">
        <div role="tablist" aria-label="Filter collections" className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((option) => {
            const count =
              option.value === "all"
                ? collections.length
                : collections.filter((c) => reviewState(c) === option.value).length;
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  active
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--border)] hover:bg-[var(--muted)]"
                }`}
              >
                {option.label} ({count})
              </button>
            );
          })}
        </div>

        <Card>
          <CardContent>
            {loadError && (
              <p role="alert" className="text-sm text-[var(--error)] mt-3">
                {loadError}
              </p>
            )}
            <MyCollectionList
              collections={shown}
              emptyMessage={
                collections.length === 0 || filter === "all"
                  ? undefined
                  : `No ${FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} collections.`
              }
            />
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
