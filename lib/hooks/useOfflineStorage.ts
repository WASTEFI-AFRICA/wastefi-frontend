import { useState, useEffect, useSyncExternalStore } from "react";
import {
  getAllItems,
  getStorageStats,
  type OfflineSubmission,
  type OfflineTransaction,
  type SyncQueueItem,
} from "@/lib/db/storage";

/**
 * React hook for offline storage
 * Provides easy access to offline data and sync status
 */

export function useOfflineSubmissions() {
  const [submissions, setSubmissions] = useState<OfflineSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setIsLoading(true);
    try {
      const data = await getAllItems("submissions");
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load offline submissions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { submissions, isLoading, refresh: loadSubmissions };
}

export function useOfflineTransactions() {
  const [transactions, setTransactions] = useState<OfflineTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setIsLoading(true);
    try {
      const data = await getAllItems("transactions");
      setTransactions(data);
    } catch (error) {
      console.error("Failed to load offline transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { transactions, isLoading, refresh: loadTransactions };
}

export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  async function loadQueue() {
    setIsLoading(true);
    try {
      const data = await getAllItems("syncQueue");
      setQueue(data);
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { queue, isLoading, refresh: loadQueue };
}

export function useStorageStats() {
  const [stats, setStats] = useState({
    pendingSubmissions: 0,
    syncQueueSize: 0,
    totalTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setIsLoading(true);
    try {
      const data = await getStorageStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load storage stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { stats, isLoading, refresh: loadStats };
}

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
