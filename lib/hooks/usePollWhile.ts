import { useEffect } from "react";

/**
 * Call `refresh` every `intervalMs` while `active` is true. The next call is
 * scheduled only after the previous one finishes, so a slow network never piles
 * requests on top of each other.
 */
export function usePollWhile(active: boolean, refresh: () => Promise<unknown>, intervalMs: number) {
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timer = setTimeout(async () => {
        await refresh().catch(() => undefined);
        if (!cancelled) schedule();
      }, intervalMs);
    };
    schedule();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, refresh, intervalMs]);
}
