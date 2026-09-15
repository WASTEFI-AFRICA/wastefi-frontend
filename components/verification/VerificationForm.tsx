"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Check, XCircle, Package, Scale, MapPin, Camera, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { CollectionStatusBadge } from "@/components/collections/CollectionStatusBadge";
import type { WasteSubmission } from "@/types/api";

/**
 * Verification Form
 * Review and verify/reject submissions
 */

interface VerificationFormProps {
  submission: WasteSubmission;
  onApprove: (data: { actualWeight: number; actualValue: number; notes?: string }) => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}

const rejectionReasons = [
  "Poor quality photos",
  "Incorrect material type",
  "Weight discrepancy",
  "Contaminated materials",
  "Incomplete information",
  "Other",
];

export function VerificationForm({
  submission,
  onApprove,
  onReject,
  onClose,
}: VerificationFormProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [actualWeight, setActualWeight] = useState(submission.weight);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const calculateValue = (weight: number) => {
    // Simple calculation - in reality would use material rates
    const ratePerKg = (submission.estimatedValue || 0) / submission.weight;
    return weight * ratePerKg;
  };

  const actualValue = calculateValue(actualWeight);

  const handleApprove = () => {
    onApprove({
      actualWeight,
      actualValue,
      notes: notes || undefined,
    });
  };

  const handleReject = () => {
    const finalReason = rejectionReason === "Other" ? customReason : rejectionReason;
    if (finalReason) {
      onReject(finalReason);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[var(--background)] rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--border)] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-lg capitalize">
                Verify {submission.materialType.replace("-", " ")} Collection
              </h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                ID: {submission.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photos ({submission.photos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Photo */}
              <div className="aspect-video rounded-lg bg-[var(--muted)] overflow-hidden">
                <img
                  src={submission.photos[selectedPhotoIndex]}
                  alt={`Collection photo ${selectedPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {submission.photos.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {submission.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhotoIndex === index
                          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                          : "border-transparent hover:border-[var(--border)]"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Material</span>
                  <Badge variant="outline" className="capitalize">
                    {submission.materialType.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Reported Weight</span>
                  <span className="font-semibold">{submission.weight} kg</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Estimated Value</span>
                  <span className="font-semibold text-[var(--success)]">
                    ${submission.estimatedValue?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--muted-foreground)]">Submitted</span>
                  <span className="text-sm">
                    {format(new Date(submission.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weight Adjustment */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Actual Weight (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="number"
                      step="0.1"
                      value={actualWeight}
                      onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                      className="w-full h-12 pl-10 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                    />
                  </div>
                  {actualWeight !== submission.weight && (
                    <p className="text-xs text-[var(--warning)] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Weight adjusted from {submission.weight} kg
                    </p>
                  )}
                </div>

                {/* Calculated Value */}
                <div className="p-3 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Actual Value</span>
                    <span className="text-xl font-bold text-[var(--success)]">
                      ${actualValue.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add any verification notes..."
                    className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          {!action ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setAction("reject")}
                className="border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)]/10"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setAction("approve")}
              >
                <Check className="w-5 h-5 mr-2" />
                Approve
              </Button>
            </div>
          ) : action === "reject" ? (
            <Card className="border-[var(--error)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--error)]">Rejection Reason</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {rejectionReasons.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/30 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rejection-reason"
                        value={reason}
                        checked={rejectionReason === reason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>
                {rejectionReason === "Other" && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    placeholder="Please specify the reason..."
                    className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--error)] focus:border-transparent outline-none resize-none text-sm"
                  />
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => setAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={handleReject}
                    disabled={
                      !rejectionReason ||
                      (rejectionReason === "Other" && !customReason)
                    }
                    className="border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)] hover:text-white"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[var(--success)]">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--success)]">Confirm Approval</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--success)]/10">
                  <p className="text-sm">
                    This will approve the collection and credit{" "}
                    <strong>${actualValue.toFixed(2)}</strong> to the collector's account.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => setAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleApprove}
                    className="bg-[var(--success)] hover:bg-[var(--success)]/90"
                  >
                    Confirm Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
