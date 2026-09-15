"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import {
  SubmissionQueue,
  VerificationForm,
  BulkActions,
} from "@/components/verification";
import { useUIStore } from "@/store/uiStore";
import type { WasteSubmission } from "@/types/api";

/**
 * Verification Page
 * Review and verify pending waste submissions
 */

// Mock pending submissions
const mockSubmissions: WasteSubmission[] = [
  {
    id: "sub-101",
    collectorId: "user-001",
    collectionPointId: "point-1",
    materialType: "plastic",
    weight: 5.5,
    photos: [
      "https://via.placeholder.com/800x600?text=Plastic+Waste+1",
      "https://via.placeholder.com/800x600?text=Plastic+Waste+2",
    ],
    status: "pending",
    location: { lat: 40.7128, lng: -74.006 },
    estimatedValue: 5.5,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-102",
    collectorId: "user-002",
    collectionPointId: "point-1",
    materialType: "cardboard",
    weight: 12.3,
    photos: [
      "https://via.placeholder.com/800x600?text=Cardboard+1",
      "https://via.placeholder.com/800x600?text=Cardboard+2",
      "https://via.placeholder.com/800x600?text=Cardboard+3",
    ],
    status: "pending",
    location: { lat: 40.7589, lng: -73.9851 },
    estimatedValue: 6.15,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-103",
    collectorId: "user-003",
    collectionPointId: "point-1",
    materialType: "metal",
    weight: 8.7,
    photos: ["https://via.placeholder.com/800x600?text=Metal+Waste"],
    status: "pending",
    location: { lat: 40.7829, lng: -73.9654 },
    estimatedValue: 10.44,
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-104",
    collectorId: "user-004",
    collectionPointId: "point-1",
    materialType: "paper",
    weight: 6.2,
    photos: [
      "https://via.placeholder.com/800x600?text=Paper+1",
      "https://via.placeholder.com/800x600?text=Paper+2",
    ],
    status: "pending",
    location: { lat: 40.7358, lng: -74.0014 },
    estimatedValue: 2.48,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-105",
    collectorId: "user-005",
    collectionPointId: "point-1",
    materialType: "glass",
    weight: 15.2,
    photos: ["https://via.placeholder.com/800x600?text=Glass+Bottles"],
    status: "pending",
    location: { lat: 40.7489, lng: -73.9680 },
    estimatedValue: 1.52,
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
  },
];

export default function VerificationPage() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<WasteSubmission | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const addToast = useUIStore((state) => state.addToast);

  const handleApprove = (
    submissionId: string,
    data: { actualWeight: number; actualValue: number; notes?: string }
  ) => {
    console.log("Approve submission:", submissionId, data);
    
    // Remove from queue
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    setSelectedSubmission(null);
    setSelectedIds((prev) => prev.filter((id) => id !== submissionId));
    
    addToast("Submission approved successfully", "success");
  };

  const handleReject = (submissionId: string, reason: string) => {
    console.log("Reject submission:", submissionId, "Reason:", reason);
    
    // Remove from queue
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    setSelectedSubmission(null);
    setSelectedIds((prev) => prev.filter((id) => id !== submissionId));
    
    addToast("Submission rejected", "error");
  };

  const handleBulkApprove = () => {
    if (
      confirm(
        `Are you sure you want to approve ${selectedIds.length} submissions? This action cannot be undone.`
      )
    ) {
      console.log("Bulk approve:", selectedIds);
      
      setSubmissions((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      
      addToast(`${selectedIds.length} submissions approved`, "success");
    }
  };

  const handleBulkReject = () => {
    const reason = prompt("Enter rejection reason for all selected submissions:");
    if (reason) {
      console.log("Bulk reject:", selectedIds, "Reason:", reason);
      
      setSubmissions((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      
      addToast(`${selectedIds.length} submissions rejected`, "error");
    }
  };

  return (
    <Container>
      <Section>
        <PageHeader
          title="Verify Collections"
          description="Review and approve pending submissions"
        />
      </Section>

      <Section spacing="sm">
        <SubmissionQueue
          submissions={submissions}
          onViewSubmission={setSelectedSubmission}
          onBulkSelect={setSelectedIds}
          selectedIds={selectedIds}
        />
      </Section>

      {/* Verification Form Modal */}
      {selectedSubmission && (
        <VerificationForm
          submission={selectedSubmission}
          onApprove={(data) => handleApprove(selectedSubmission.id, data)}
          onReject={(reason) => handleReject(selectedSubmission.id, reason)}
          onClose={() => setSelectedSubmission(null)}
        />
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        onApproveAll={handleBulkApprove}
        onRejectAll={handleBulkReject}
        onClearSelection={() => setSelectedIds([])}
      />
    </Container>
  );
}
