import { useSyncExternalStore } from "react";

function subscribeToConnection(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * Hook to monitor online/offline status.
 *
 * The server renders as online. It has no connection state: Node defines a global
 * `navigator` without `onLine`, so reading it there gave `undefined`, the server
 * rendered the offline badge, and React rebuilt every page on load. The browser's
 * real value takes over right after hydration.
 */
export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribeToConnection,
    () => navigator.onLine,
    () => true
  );
}
