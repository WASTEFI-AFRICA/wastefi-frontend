"use client";

import { Check, XCircle, X } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

/**
 * Bulk Actions Bar
 * Actions for multiple selected submissions
 */

interface BulkActionsProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <Card className="shadow-2xl border-2 border-[var(--primary)]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
                {selectedCount}
              </div>
              <span className="font-medium">
                {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
              </span>
            </div>

            <div className="h-6 w-px bg-[var(--border)]" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onApproveAll}
                className="border-[var(--success)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRejectAll}
                className="border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)] hover:text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject All
              </Button>
              <button
                onClick={onClearSelection}
                className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
