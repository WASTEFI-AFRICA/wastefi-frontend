"use client";

import { useEffect } from "react";
import { syncManager } from "@/lib/sync/syncManager";
import { initDB } from "@/lib/db/storage";
import { useAuthStore } from "@/store/authStore";

/**
 * Sync Provider
 * Initializes offline storage and sync manager
 */

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Initialize IndexedDB
    initDB().catch((error) => {
      console.error("Failed to initialize database:", error);
    });

    // Start auto-sync if authenticated
    if (isAuthenticated) {
      syncManager.startAutoSync();
    }

    return () => {
      // Cleanup on unmount
      syncManager.stopAutoSync();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}
