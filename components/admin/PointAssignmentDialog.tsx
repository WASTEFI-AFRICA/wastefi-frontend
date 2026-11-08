"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APIError } from "@/lib/api/client";
import {
  assignPoint,
  getAssignablePoints,
  type AdminUser,
} from "@/lib/api/admin-users";
import { useAuthStore } from "@/store/authStore";

export function PointAssignmentDialog({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser;
  onClose: (refresh?: boolean) => void;
  onSaved: (message: string) => Promise<void>;
}) {
  const adminId = useAuthStore((state) => state.user?.id);
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const headingId = useId(),
    fieldId = useId(),
    descriptionId = useId();
  const [selected, setSelected] = useState(user.collectionPoint?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const points = useQuery({
    queryKey: ["admin-assignable-points", adminId],
    queryFn: ({ signal }) => getAssignablePoints(signal),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element?.showModal();
    return () => {
      element?.close();
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, []);
  const name = `${user.firstName} ${user.lastName}`.trim() || user.phoneNumber;
  const validSelection =
    selected === "" || points.data?.some((point) => point.id === selected);
  const changed = selected !== (user.collectionPoint?.id ?? "");

  async function save() {
    if (
      busy.current ||
      !changed ||
      !validSelection ||
      needsRefresh ||
      points.isFetching ||
      points.isError
    )
      return;
    busy.current = true;
    setSaving(true);
    setError(null);
    try {
      const point = await assignPoint(user.id, selected || null);
      if (useAuthStore.getState().user?.id !== adminId) return;
      await onSaved(
        point
          ? `${name} is now assigned to ${point.name}.`
          : `Collection point access removed for ${name}.`,
      );
    } catch (failure) {
      if (useAuthStore.getState().user?.id !== adminId) return;
      const known =
        failure instanceof APIError &&
        [400, 403, 404, 409].includes(failure.status);
      setNeedsRefresh(true);
      setError(
        known
          ? "Assignment was not saved. The account or point may have changed, or you may lack permission. Close and refresh users before trying again."
          : "Assignment could not be confirmed. Close and refresh users to check the current assignment before trying again.",
      );
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy.current) onClose(needsRefresh);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy.current)
          onClose(needsRefresh);
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-0 text-[var(--foreground)] shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--primary)]">
            <MapPin className="h-4 w-4" aria-hidden="true" /> Operator access
          </p>
          <h2 id={headingId} className="text-xl font-semibold">
            Assign collection point
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Close point assignment"
          disabled={saving}
          onClick={() => onClose(needsRefresh)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <form
        className="space-y-5 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <div className="min-w-0 rounded-xl bg-[var(--accent)] p-4 text-sm [overflow-wrap:anywhere]">
          <p className="font-semibold">{name}</p>
          <p className="mt-1 text-[var(--muted-foreground)]">
            {user.phoneNumber}
          </p>
        </div>
        <p
          id={descriptionId}
          className="text-sm leading-relaxed text-[var(--muted-foreground)]"
        >
          This operator can read and review deliveries only at the assigned
          active point. Removing the assignment blocks that access. Account
          status and role stay unchanged.
        </p>
        {points.isPending ? (
          <p role="status" className="text-sm">
            Loading collection points…
          </p>
        ) : points.isError ? (
          <div role="alert" className="space-y-3 text-sm">
            <p>
              Collection points could not be loaded. No assignment has been
              changed.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={points.isFetching}
              onClick={() => void points.refetch()}
            >
              Reload points
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor={fieldId} className="text-sm font-medium">
              Collection point
            </label>
            <select
              id={fieldId}
              value={selected}
              disabled={saving || needsRefresh}
              onChange={(event) => setSelected(event.target.value)}
              className="block h-11 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              <option value="">No collection point</option>
              {user.collectionPoint &&
              !points.data?.some(
                (point) => point.id === user.collectionPoint?.id,
              ) ? (
                <option value={user.collectionPoint.id} disabled>
                  {user.collectionPoint.name} (unavailable)
                </option>
              ) : null}
              {points.data?.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
            {points.data?.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                No active points are available. You can still remove the current
                assignment.
              </p>
            ) : null}
          </div>
        )}
        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950"
          >
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border)] pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onClose(needsRefresh)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              saving ||
              !changed ||
              !validSelection ||
              needsRefresh ||
              points.isPending ||
              points.isFetching ||
              points.isError
            }
          >
            {saving ? "Saving…" : "Save assignment"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
