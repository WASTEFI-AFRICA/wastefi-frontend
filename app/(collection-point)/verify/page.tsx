"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  SubmissionQueue,
  VerificationForm,
  BulkActions,
  ChainProgress,
  isChainSettled,
} from "@/components/verification";
import { useUIStore } from "@/store/uiStore";
import {
  getCollection,
  listVerificationQueue,
  reviewCollection,
  toSubmission,
  type ApiCollection,
} from "@/lib/api/collections";
import type { WasteSubmission } from "@/types/api";

/**
 * Verification Page
 * The collection point's queue of submissions waiting for review, from the API.
 * Approving one also records it on Stellar and mints WASTE to the collector; the
 * "Approved just now" list follows that until the payment lands.
 */

const POLL_MS = 4000;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function VerificationPage() {
  const [queue, setQueue] = useState<ApiCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WasteSubmission | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approved, setApproved] = useState<ApiCollection[]>([]);
  const addToast = useUIStore((state) => state.addToast);

  // Every state update happens when the request settles, so this can start from an effect.
  const fetchQueue = useCallback(
    () =>
      listVerificationQueue()
        .then((collections) => {
          setQueue(collections);
          setLoadError(null);
        })
        .catch((error) =>
          setLoadError(errorMessage(error, "Could not load the verification queue."))
        )
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const reloadQueue = () => {
    setIsLoading(true);
    setLoadError(null);
    void fetchQueue();
  };

  // Follow approved collections until they are paid on-chain.
  const inProgressKey = approved
    .filter((c) => !isChainSettled(c.chainStatus))
    .map((c) => c.id)
    .join(",");
  useEffect(() => {
    if (!inProgressKey) return;
    const timer = setInterval(async () => {
      const ids = inProgressKey.split(",");
      const updates = await Promise.allSettled(ids.map((id) => getCollection(id)));
      setApproved((current) =>
        current.map((c) => {
          const index = ids.indexOf(c.id);
          const update = index >= 0 ? updates[index] : undefined;
          return update?.status === "fulfilled" ? update.value : c;
        })
      );
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [inProgressKey]);

  const submissions = useMemo(() => queue.map(toSubmission), [queue]);

  const removeFromQueue = (ids: string[]) => {
    setQueue((current) => current.filter((c) => !ids.includes(c.id)));
    setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
  };

  /** Send one decision. Returns whether it succeeded. */
  const review = async (
    id: string,
    decision: { approved: boolean; notes?: string; adjustedWeight?: number }
  ): Promise<boolean> => {
    try {
      const updated = await reviewCollection(id, decision);
      removeFromQueue([id]);
      if (decision.approved) setApproved((current) => [updated, ...current]);
      return true;
    } catch (error) {
      addToast(errorMessage(error, "The decision could not be saved. Please try again."), "error");
      return false;
    }
  };

  const handleApprove = async (
    submission: WasteSubmission,
    data: { actualWeight: number; notes?: string }
  ) => {
    setIsSubmitting(true);
    const ok = await review(submission.id, {
      approved: true,
      notes: data.notes,
      adjustedWeight: data.actualWeight !== submission.weight ? data.actualWeight : undefined,
    });
    setIsSubmitting(false);
    if (ok) {
      setSelected(null);
      addToast("Approved. Recording it on Stellar now.", "success");
    }
  };

  const handleReject = async (submission: WasteSubmission, reason: string) => {
    setIsSubmitting(true);
    const ok = await review(submission.id, { approved: false, notes: reason });
    setIsSubmitting(false);
    if (ok) {
      setSelected(null);
      addToast("Submission rejected", "info");
    }
  };

  const handleBulkApprove = async () => {
    if (!confirm(`Approve ${selectedIds.length} submissions? This cannot be undone.`)) return;
    let done = 0;
    for (const id of [...selectedIds]) {
      if (await review(id, { approved: true })) done += 1;
    }
    addToast(`${done} submissions approved`, "success");
  };

  const handleBulkReject = async () => {
    const reason = prompt("Enter rejection reason for all selected submissions:");
    if (!reason) return;
    let done = 0;
    for (const id of [...selectedIds]) {
      if (await review(id, { approved: false, notes: reason })) done += 1;
    }
    addToast(`${done} submissions rejected`, "info");
  };

  return (
    <Container>
      <Section>
        <PageHeader
          title="Verify Collections"
          description="Review and approve pending submissions"
          actions={
            <Button variant="outline" size="sm" onClick={reloadQueue} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Refresh
            </Button>
          }
        />
      </Section>

      {approved.length > 0 && (
        <Section spacing="sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Approved just now</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Each approval is recorded, verified and paid on Stellar. On testnet this
                usually takes one to two minutes.
              </p>
            </CardHeader>
            <CardContent className="divide-y divide-[var(--border)] p-0">
              {approved.map((collection) => (
                <div key={collection.id} className="p-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {collection.weight} kg {collection.materialType}
                    </span>
                    {collection.collector && (
                      <span className="text-[var(--muted-foreground)]">
                        {" "}
                        from {collection.collector.firstName} {collection.collector.lastName}
                      </span>
                    )}
                  </p>
                  <ChainProgress collection={collection} />
                </div>
              ))}
            </CardContent>
          </Card>
        </Section>
      )}

      <Section spacing="sm">
        {loadError ? (
          <Card>
            <CardContent className="p-6 space-y-3 text-center">
              <p role="alert" className="text-[var(--error)]">
                {loadError}
              </p>
              <Button variant="outline" onClick={reloadQueue}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading && queue.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-[var(--muted-foreground)]" role="status">
              Loading the verification queue...
            </CardContent>
          </Card>
        ) : (
          <SubmissionQueue
            submissions={submissions}
            onViewSubmission={setSelected}
            onBulkSelect={setSelectedIds}
            selectedIds={selectedIds}
          />
        )}
      </Section>

      {/* Verification Form Modal */}
      {selected && (
        <VerificationForm
          submission={selected}
          isSubmitting={isSubmitting}
          onApprove={(data) => void handleApprove(selected, data)}
          onReject={(reason) => void handleReject(selected, reason)}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        onApproveAll={() => void handleBulkApprove()}
        onRejectAll={() => void handleBulkReject()}
        onClearSelection={() => setSelectedIds([])}
      />
    </Container>
  );
}
