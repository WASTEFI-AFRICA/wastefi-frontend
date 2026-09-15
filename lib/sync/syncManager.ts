import { api } from "@/lib/api/client";
import {
  getSyncQueue,
  removeFromSyncQueue,
  incrementRetryCount,
  getPendingSubmissions,
  markSubmissionSynced,
  markSubmissionFailed,
  type SyncQueueItem,
  type OfflineSubmission,
} from "@/lib/db/storage";
import { useUIStore } from "@/store/uiStore";

/**
 * Sync Manager
 * Handles background synchronization of offline data
 */

const MAX_RETRY_COUNT = 3;
const SYNC_INTERVAL = 30000; // 30 seconds

export class SyncManager {
  private isSyncing = false;
  private syncIntervalId: NodeJS.Timeout | null = null;

  /**
   * Start automatic background sync
   */
  startAutoSync(): void {
    if (this.syncIntervalId) return;

    // Initial sync
    this.syncAll();

    // Set up periodic sync
    this.syncIntervalId = setInterval(() => {
      this.syncAll();
    }, SYNC_INTERVAL);

    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        useUIStore.getState().setOnline(true);
        this.syncAll();
      });

      window.addEventListener("offline", () => {
        useUIStore.getState().setOnline(false);
      });
    }
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
    }
  }

  /**
   * Sync all pending data
   */
  async syncAll(): Promise<void> {
    if (this.isSyncing) return;
    if (!navigator.onLine) return;

    this.isSyncing = true;

    try {
      // Sync pending submissions
      await this.syncSubmissions();

      // Sync queue items
      await this.syncQueue();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync pending waste submissions
   */
  private async syncSubmissions(): Promise<void> {
    const pending = await getPendingSubmissions();

    for (const submission of pending) {
      // Skip if max retries exceeded
      if (submission.retryCount >= MAX_RETRY_COUNT) {
        await markSubmissionFailed(submission.id);
        continue;
      }

      try {
        // Send to API
        await api.post("/submissions", {
          collectionPointId: submission.collectionPointId,
          materialType: submission.materialType,
          weight: submission.weight,
          photos: submission.photos,
        });

        // Mark as synced
        await markSubmissionSynced(submission.id);

        // Show success toast
        useUIStore.getState().addToast(
          "Submission synced successfully",
          "success"
        );
      } catch (error) {
        console.error("Failed to sync submission:", error);
        await markSubmissionFailed(submission.id);
      }
    }
  }

  /**
   * Sync queue items
   */
  private async syncQueue(): Promise<void> {
    const queue = await getSyncQueue();

    for (const item of queue) {
      // Skip if max retries exceeded
      if (item.retryCount >= MAX_RETRY_COUNT) {
        await removeFromSyncQueue(item.id);
        continue;
      }

      try {
        await this.syncQueueItem(item);
        await removeFromSyncQueue(item.id);
      } catch (error) {
        console.error("Failed to sync queue item:", error);
        await incrementRetryCount(item.id);
      }
    }
  }

  /**
   * Sync individual queue item
   */
  private async syncQueueItem(item: SyncQueueItem): Promise<void> {
    const { type, action, data } = item;

    switch (type) {
      case "submission":
        if (action === "create") {
          await api.post("/submissions", data);
        }
        break;

      case "transaction":
        if (action === "create") {
          await api.post("/transactions", data);
        }
        break;

      case "profile":
        if (action === "update") {
          await api.put("/users/profile", data);
        }
        break;

      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
  }

  /**
   * Force sync now (manual trigger)
   */
  async forceSyncNow(): Promise<boolean> {
    if (!navigator.onLine) {
      useUIStore.getState().addToast(
        "Cannot sync while offline",
        "warning"
      );
      return false;
    }

    await this.syncAll();
    return true;
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { isSyncing: boolean; isAutoSyncEnabled: boolean } {
    return {
      isSyncing: this.isSyncing,
      isAutoSyncEnabled: this.syncIntervalId !== null,
    };
  }
}

// Singleton instance
export const syncManager = new SyncManager();
