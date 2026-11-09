"use client";

import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";
import { Badge } from "@/components/ui";

/**
 * Offline Indicator Component
 * Shows a notice while the browser has no connection
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
        <span className="font-medium">You are offline</span>
      </Badge>
    </div>
  );
}
