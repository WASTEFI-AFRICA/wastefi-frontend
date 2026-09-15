# Offline-First Architecture

## Overview

WasteFi implements a comprehensive offline-first architecture to ensure the application works reliably in low-connectivity environments common in emerging markets.

## Architecture Components

### 1. IndexedDB Storage (`lib/db/storage.ts`)

Persistent client-side database for offline data storage.

#### Stores:

**Submissions**
- Stores waste collection submissions created while offline
- Indexed by status and creation date
- Automatically synced when connection is restored

**Transactions**
- Stores wallet transactions for offline viewing
- Cached for performance
- Updated on sync

**Collections**
- Historical collection data
- Used for analytics and statistics

**Sync Queue**
- Manages pending operations
- Priority-based ordering
- Retry logic with exponential backoff

#### Usage Example:

```tsx
import {
  savePendingSubmission,
  getPendingSubmissions,
  addToSyncQueue,
} from "@/lib/db/storage";

// Save offline submission
await savePendingSubmission({
  id: crypto.randomUUID(),
  collectorId: "user-123",
  collectionPointId: "point-456",
  materialType: "PET_PLASTIC",
  weight: 5.5,
  photos: ["base64-encoded-image"],
  status: "pending_sync",
  createdAt: new Date().toISOString(),
  retryCount: 0,
});

// Get pending submissions
const pending = await getPendingSubmissions();
console.log(`${pending.length} submissions waiting to sync`);

// Add to sync queue
await addToSyncQueue({
  id: crypto.randomUUID(),
  type: "submission",
  action: "create",
  data: { /* submission data */ },
  priority: 1,
  retryCount: 0,
  createdAt: new Date().toISOString(),
});
```

### 2. Sync Manager (`lib/sync/syncManager.ts`)

Background synchronization service that automatically syncs offline data.

#### Features:

- **Automatic Sync**: Runs every 30 seconds when online
- **Priority Queue**: Processes high-priority items first
- **Retry Logic**: Retries failed syncs up to 3 times
- **Network Awareness**: Pauses when offline, resumes when online
- **Event Listeners**: Responds to online/offline events

#### Usage Example:

```tsx
import { syncManager } from "@/lib/sync/syncManager";

// Start auto-sync (done automatically in SyncProvider)
syncManager.startAutoSync();

// Force immediate sync
await syncManager.forceSyncNow();

// Get sync status
const { isSyncing, isAutoSyncEnabled } = syncManager.getSyncStatus();

// Stop auto-sync
syncManager.stopAutoSync();
```

#### Sync Flow:

1. Check if online
2. Get pending submissions from IndexedDB
3. For each submission:
   - Send to API
   - Mark as synced if successful
   - Increment retry count if failed
   - Skip if max retries exceeded
4. Process sync queue
5. Show toast notifications for results

### 3. React Hooks (`lib/hooks/useOfflineStorage.ts`)

Convenient hooks for accessing offline data in components.

#### Available Hooks:

**useOfflineSubmissions**
```tsx
const { submissions, isLoading, refresh } = useOfflineSubmissions();
```

**useOfflineTransactions**
```tsx
const { transactions, isLoading, refresh } = useOfflineTransactions();
```

**useSyncQueue**
```tsx
const { queue, isLoading, refresh } = useSyncQueue();
```

**useStorageStats**
```tsx
const { stats, isLoading, refresh } = useStorageStats();
// stats = { pendingSubmissions, syncQueueSize, totalTransactions }
```

**useOnlineStatus**
```tsx
const isOnline = useOnlineStatus();
```

#### Usage Example:

```tsx
function MyComponent() {
  const { submissions, isLoading } = useOfflineSubmissions();
  const { stats } = useStorageStats();
  const isOnline = useOnlineStatus();

  return (
    <div>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
      <p>Pending: {stats.pendingSubmissions}</p>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {submissions.map((sub) => (
            <li key={sub.id}>{sub.materialType} - {sub.weight}kg</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 4. Service Worker Caching

Enhanced PWA caching strategies in `next.config.ts`:

#### Cache Strategies:

**CacheFirst** (Fonts, Static Assets)
- Check cache first, fall back to network
- Perfect for unchanging resources
- 1-year expiration for fonts

**StaleWhileRevalidate** (Images, CSS, JS)
- Return cached version immediately
- Update cache in background
- 24-hour expiration

**NetworkFirst** (API Calls)
- Try network first
- Fall back to cache if offline or slow (>10s)
- 5-minute cache expiration

#### Cached Resources:

- Google Fonts
- Images (JPG, PNG, SVG, WebP)
- JavaScript bundles
- CSS stylesheets
- Next.js data files
- API GET requests

### 5. UI Components

#### OfflineIndicator
Shows visual feedback when offline:

```tsx
import { OfflineIndicator } from "@/components/offline/OfflineIndicator";

<OfflineIndicator /> // Shows "Offline Mode" badge when offline
```

#### SyncStatusBadge
Displays sync status with pending count:

```tsx
import { SyncStatusBadge } from "@/components/offline/OfflineIndicator";

<SyncStatusBadge 
  pendingCount={5} 
  isSyncing={true} 
/>
```

### 6. SyncProvider

Client component that initializes offline infrastructure:

```tsx
// Already included in app/layout.tsx
<SyncProvider>
  <YourApp />
</SyncProvider>
```

**Responsibilities:**
- Initialize IndexedDB on mount
- Start sync manager when user is authenticated
- Clean up on unmount

## Offline Workflow

### Creating a Submission Offline:

1. User fills out submission form
2. Photos are converted to base64
3. Submission is saved to IndexedDB
4. Added to sync queue with priority
5. User sees confirmation: "Saved offline, will sync when online"
6. Offline indicator shows "1 pending"

### Automatic Sync When Online:

1. Network connection restored
2. Sync manager detects online event
3. Gets pending submissions from IndexedDB
4. Sends each to API sequentially
5. Marks successful ones as synced
6. Shows toast: "Submission synced successfully"
7. Updates UI to reflect synced status

### Handling Sync Failures:

1. Submission fails to sync
2. Retry count incremented
3. Tries again on next sync cycle (30s)
4. After 3 failed attempts, marked as "failed"
5. User notified to check data and retry manually

## Data Flow

```
┌─────────────┐
│   User      │
│  Action     │
└──────┬──────┘
       │
       ▼
┌─────────────┐    Offline    ┌─────────────┐
│  Component  │─────────────▶ │  IndexedDB  │
└──────┬──────┘               └──────┬──────┘
       │                             │
       │ Online                      │
       ▼                             │
┌─────────────┐                      │
│   API       │◀─────────────────────┘
│  Request    │      Sync Manager
└─────────────┘
```

## Performance Optimizations

1. **Lazy Initialization**: IndexedDB initialized only when needed
2. **Batch Sync**: Multiple items synced in one cycle
3. **Priority Queue**: Critical data synced first
4. **Cache Expiration**: Prevents excessive storage use
5. **Network Timeout**: Falls back to cache after 10s

## Storage Limits

- **IndexedDB**: ~50MB typical, up to several GB
- **Service Worker Cache**: ~50-100MB recommended
- **LocalStorage**: 5-10MB (used for auth token only)

## Best Practices

### For Developers:

1. **Always check online status** before API calls
2. **Save to IndexedDB immediately** for offline support
3. **Show clear offline indicators** to users
4. **Handle sync failures gracefully**
5. **Test offline scenarios** thoroughly

### Example Pattern:

```tsx
import { useOnlineStatus } from "@/lib/hooks/useOfflineStorage";
import { savePendingSubmission, addToSyncQueue } from "@/lib/db/storage";
import { api } from "@/lib/api/client";

async function submitWaste(data) {
  const isOnline = navigator.onLine;
  
  if (isOnline) {
    try {
      // Try API first
      await api.post("/submissions", data);
      toast("Submitted successfully", "success");
    } catch (error) {
      // Fallback to offline
      await saveOffline(data);
    }
  } else {
    // Save offline immediately
    await saveOffline(data);
  }
}

async function saveOffline(data) {
  await savePendingSubmission({
    ...data,
    id: crypto.randomUUID(),
    status: "pending_sync",
    retryCount: 0,
  });
  
  toast("Saved offline, will sync when online", "info");
}
```

## Debugging

### Check IndexedDB:

1. Open DevTools → Application → IndexedDB
2. Expand "wastefi-db"
3. View stores: submissions, transactions, syncQueue

### Monitor Service Worker:

1. Open DevTools → Application → Service Workers
2. Check registration status
3. View cache storage
4. Inspect cached resources

### Test Offline Mode:

1. DevTools → Network → Throttling
2. Select "Offline"
3. Test creating submissions
4. Re-enable network
5. Watch sync manager process queue

## Security Considerations

1. **No Sensitive Data in IndexedDB**: API tokens stored in encrypted localStorage
2. **Local-Only Storage**: IndexedDB accessible only to same origin
3. **Sync Validation**: Server validates all synced data
4. **Cache Invalidation**: Sensitive data not cached by service worker

## Future Enhancements

- [ ] Conflict resolution for concurrent edits
- [ ] Differential sync (only changed data)
- [ ] Background sync API integration
- [ ] Compression for cached images
- [ ] Selective sync (user chooses what to sync)
- [ ] Storage quota management UI

## Troubleshooting

**Issue**: Data not syncing
- Check network connection
- Verify sync manager is running
- Check browser console for errors
- Inspect IndexedDB for pending items

**Issue**: Storage quota exceeded
- Clear old cached data
- Reduce image quality
- Delete synced submissions

**Issue**: Slow performance
- Reduce cache expiration times
- Limit number of cached items
- Use smaller images offline
