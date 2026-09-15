"use client";

import { useOnlineStatus } from "@/lib/hooks/useOfflineStorage";
import { WifiOff, Wifi } from "lucide-react";
import { Badge } from "@/components/ui";

/**
 * Offline Indicator Component
 * Shows connection status and pending sync items
 */

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null; // Don't show indicator when online
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <Badge
        variant="warning"
        className="flex items-center gap-2 px-4 py-2 shadow-lg"
      >
        <WifiOff className="w-4 h-4" />
        <span className="font-medium">Offline Mode</span>
      </Badge>
    </div>
  );
}

/**
 * Sync Status Badge
 * Shows number of pending items
 */

interface SyncStatusBadgeProps {
  pendingCount: number;
  isSyncing?: boolean;
}

export function SyncStatusBadge({
  pendingCount,
  isSyncing = false,
}: SyncStatusBadgeProps) {
  if (pendingCount === 0 && !isSyncing) {
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <Wifi className="w-3 h-3" />
        <span className="text-xs">Synced</span>
      </Badge>
    );
  }

  return (
    <Badge variant="warning" className="flex items-center gap-1">
      {isSyncing ? (
        <>
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Syncing...</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span className="text-xs">{pendingCount} pending</span>
        </>
      )}
    </Badge>
  );
}
