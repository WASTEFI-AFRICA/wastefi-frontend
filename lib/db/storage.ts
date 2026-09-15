import { openDB, DBSchema, IDBPDatabase } from "idb";

/**
 * IndexedDB Storage Layer
 * Offline-first data persistence for WasteFi
 */

// Database schema definition
interface WasteFiDB extends DBSchema {
  submissions: {
    key: string;
    value: OfflineSubmission;
    indexes: { "by-status": string; "by-date": string };
  };
  transactions: {
    key: string;
    value: OfflineTransaction;
    indexes: { "by-date": string };
  };
  collections: {
    key: string;
    value: OfflineCollection;
    indexes: { "by-date": string };
  };
  syncQueue: {
    key: string;
    value: SyncQueueItem;
    indexes: { "by-priority": number; "by-date": string };
  };
}

export interface OfflineSubmission {
  id: string;
  collectorId: string;
  collectionPointId: string;
  materialType: string;
  weight: number;
  photos: string[]; // Base64 encoded images
  status: "pending_sync" | "synced" | "failed";
  createdAt: string;
  syncedAt?: string;
  retryCount: number;
}

export interface OfflineTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: string;
  synced: boolean;
}

export interface OfflineCollection {
  id: string;
  pointName: string;
  materialType: string;
  weight: number;
  value: number;
  date: string;
}

export interface SyncQueueItem {
  id: string;
  type: "submission" | "transaction" | "profile";
  action: "create" | "update" | "delete";
  data: any;
  priority: number; // Lower = higher priority
  retryCount: number;
  createdAt: string;
  lastAttempt?: string;
}

const DB_NAME = "wastefi-db";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<WasteFiDB> | null = null;

/**
 * Initialize and open the database
 */
export async function initDB(): Promise<IDBPDatabase<WasteFiDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<WasteFiDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Submissions store
      if (!db.objectStoreNames.contains("submissions")) {
        const submissionStore = db.createObjectStore("submissions", {
          keyPath: "id",
        });
        submissionStore.createIndex("by-status", "status");
        submissionStore.createIndex("by-date", "createdAt");
      }

      // Transactions store
      if (!db.objectStoreNames.contains("transactions")) {
        const transactionStore = db.createObjectStore("transactions", {
          keyPath: "id",
        });
        transactionStore.createIndex("by-date", "createdAt");
      }

      // Collections store
      if (!db.objectStoreNames.contains("collections")) {
        const collectionStore = db.createObjectStore("collections", {
          keyPath: "id",
        });
        collectionStore.createIndex("by-date", "date");
      }

      // Sync queue store
      if (!db.objectStoreNames.contains("syncQueue")) {
        const syncStore = db.createObjectStore("syncQueue", {
          keyPath: "id",
        });
        syncStore.createIndex("by-priority", "priority");
        syncStore.createIndex("by-date", "createdAt");
      }
    },
  });

  return dbInstance;
}

/**
 * Generic CRUD operations
 */

export async function addItem<K extends keyof WasteFiDB>(
  storeName: K,
  item: WasteFiDB[K]["value"]
): Promise<void> {
  const db = await initDB();
  await db.add(storeName as any, item);
}

export async function getItem<K extends keyof WasteFiDB>(
  storeName: K,
  key: string
): Promise<WasteFiDB[K]["value"] | undefined> {
  const db = await initDB();
  return db.get(storeName as any, key);
}

export async function getAllItems<K extends keyof WasteFiDB>(
  storeName: K
): Promise<WasteFiDB[K]["value"][]> {
  const db = await initDB();
  return db.getAll(storeName as any);
}

export async function updateItem<K extends keyof WasteFiDB>(
  storeName: K,
  item: WasteFiDB[K]["value"]
): Promise<void> {
  const db = await initDB();
  await db.put(storeName as any, item);
}

export async function deleteItem<K extends keyof WasteFiDB>(
  storeName: K,
  key: string
): Promise<void> {
  const db = await initDB();
  await db.delete(storeName as any, key);
}

export async function clearStore<K extends keyof WasteFiDB>(
  storeName: K
): Promise<void> {
  const db = await initDB();
  await db.clear(storeName as any);
}

/**
 * Submission-specific operations
 */

export async function savePendingSubmission(
  submission: OfflineSubmission
): Promise<void> {
  await addItem("submissions", submission);
}

export async function getPendingSubmissions(): Promise<OfflineSubmission[]> {
  const db = await initDB();
  return db.getAllFromIndex("submissions", "by-status", "pending_sync");
}

export async function markSubmissionSynced(id: string): Promise<void> {
  const submission = await getItem("submissions", id);
  if (submission) {
    submission.status = "synced";
    submission.syncedAt = new Date().toISOString();
    await updateItem("submissions", submission);
  }
}

export async function markSubmissionFailed(id: string): Promise<void> {
  const submission = await getItem("submissions", id);
  if (submission) {
    submission.status = "failed";
    submission.retryCount += 1;
    await updateItem("submissions", submission);
  }
}

/**
 * Sync queue operations
 */

export async function addToSyncQueue(item: SyncQueueItem): Promise<void> {
  await addItem("syncQueue", item);
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await initDB();
  return db.getAllFromIndex("syncQueue", "by-priority");
}

export async function removeFromSyncQueue(id: string): Promise<void> {
  await deleteItem("syncQueue", id);
}

export async function incrementRetryCount(id: string): Promise<void> {
  const item = await getItem("syncQueue", id);
  if (item) {
    item.retryCount += 1;
    item.lastAttempt = new Date().toISOString();
    await updateItem("syncQueue", item);
  }
}

/**
 * Storage statistics
 */

export async function getStorageStats(): Promise<{
  pendingSubmissions: number;
  syncQueueSize: number;
  totalTransactions: number;
}> {
  const pendingSubmissions = await getPendingSubmissions();
  const syncQueue = await getSyncQueue();
  const transactions = await getAllItems("transactions");

  return {
    pendingSubmissions: pendingSubmissions.length,
    syncQueueSize: syncQueue.length,
    totalTransactions: transactions.length,
  };
}

/**
 * Clear all offline data (logout)
 */

export async function clearAllData(): Promise<void> {
  await clearStore("submissions");
  await clearStore("transactions");
  await clearStore("collections");
  await clearStore("syncQueue");
}
