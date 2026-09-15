"use client";

import { format } from "date-fns";
import { Package, Eye, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { CollectionStatusBadge } from "@/components/collections/CollectionStatusBadge";
import type { WasteSubmission } from "@/types/api";

/**
 * Submission Queue
 * Display pending submissions for verification
 */

interface SubmissionQueueProps {
  submissions: WasteSubmission[];
  onViewSubmission: (submission: WasteSubmission) => void;
  onBulkSelect?: (submissionIds: string[]) => void;
  selectedIds?: string[];
}

export function SubmissionQueue({
  submissions,
  onViewSubmission,
  onBulkSelect,
  selectedIds = [],
}: SubmissionQueueProps) {
  const handleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      onBulkSelect?.([]);
    } else {
      onBulkSelect?.(submissions.map((s) => s.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onBulkSelect?.(selectedIds.filter((sid) => sid !== id));
    } else {
      onBulkSelect?.([...selectedIds, id]);
    }
  };

  const allSelected = submissions.length > 0 && selectedIds.length === submissions.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Pending Verification ({submissions.length})
          </CardTitle>
          {onBulkSelect && submissions.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              <CheckSquare className="w-4 h-4 mr-2" />
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {submissions.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {submissions.map((submission) => {
              const isSelected = selectedIds.includes(submission.id);
              return (
                <div
                  key={submission.id}
                  className={`p-4 hover:bg-[var(--muted)]/30 transition-colors ${
                    isSelected ? "bg-[var(--primary)]/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    {onBulkSelect && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(submission.id)}
                        className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[var(--primary)]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold capitalize">
                            {submission.materialType.replace("-", " ")}
                          </h4>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            ID: {submission.id.slice(0, 8)}
                          </p>
                        </div>
                        <CollectionStatusBadge status={submission.status} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-[var(--muted-foreground)]">Weight:</span>{" "}
                          <span className="font-medium">{submission.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">Value:</span>{" "}
                          <span className="font-medium text-[var(--success)]">
                            ${submission.estimatedValue?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">Photos:</span>{" "}
                          <span className="font-medium">{submission.photos.length}</span>
                        </div>
                        <div>
                          <span className="text-[var(--muted-foreground)]">Time:</span>{" "}
                          <span className="font-medium">
                            {format(new Date(submission.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSubmission(submission)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--muted-foreground)]">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending submissions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
