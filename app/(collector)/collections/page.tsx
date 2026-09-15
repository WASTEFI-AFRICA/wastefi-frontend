"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, Button } from "@/components/ui";
import {
  CollectionCard,
  CollectionFilter,
  CollectionDetail,
} from "@/components/collections";
import { Package, ArrowUpDown } from "lucide-react";
import type { WasteSubmission, CollectionStatus, MaterialType } from "@/types/api";

/**
 * Collections Page
 * View and manage collection history
 */

// Mock data - Replace with API call
const mockCollections: WasteSubmission[] = [
  {
    id: "sub-001",
    collectorId: "user-123",
    collectionPointId: "point-1",
    materialType: "plastic",
    weight: 5.5,
    photos: ["https://via.placeholder.com/300"],
    status: "paid",
    location: { lat: 40.7128, lng: -74.006 },
    estimatedValue: 5.5,
    actualValue: 5.25,
    verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-002",
    collectorId: "user-123",
    collectionPointId: "point-1",
    materialType: "cardboard",
    weight: 12.3,
    photos: ["https://via.placeholder.com/300", "https://via.placeholder.com/300"],
    status: "verified",
    location: { lat: 40.7589, lng: -73.9851 },
    estimatedValue: 6.15,
    actualValue: 6.0,
    verifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-003",
    collectorId: "user-123",
    collectionPointId: "point-2",
    materialType: "metal",
    weight: 8.7,
    photos: ["https://via.placeholder.com/300"],
    status: "pending",
    location: { lat: 40.7829, lng: -73.9654 },
    estimatedValue: 10.44,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-004",
    collectorId: "user-123",
    collectionPointId: "point-1",
    materialType: "glass",
    weight: 15.2,
    photos: ["https://via.placeholder.com/300", "https://via.placeholder.com/300", "https://via.placeholder.com/300"],
    status: "rejected",
    location: { lat: 40.7358, lng: -74.0014 },
    estimatedValue: 1.52,
    verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-005",
    collectorId: "user-123",
    collectionPointId: "point-3",
    materialType: "e-waste",
    weight: 3.4,
    photos: ["https://via.placeholder.com/300"],
    status: "paid",
    location: { lat: 40.7489, lng: -73.9680 },
    estimatedValue: 6.8,
    actualValue: 7.0,
    verifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function CollectionsPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<CollectionStatus[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedCollection, setSelectedCollection] = useState<WasteSubmission | null>(null);

  // Filter and sort collections
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = mockCollections;

    // Apply status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((c) => selectedStatuses.includes(c.status));
    }

    // Apply material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((c) => selectedMaterials.includes(c.materialType));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return (b.actualValue || b.estimatedValue || 0) - (a.actualValue || a.estimatedValue || 0);
        case "lowest":
          return (a.actualValue || a.estimatedValue || 0) - (b.actualValue || b.estimatedValue || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [selectedStatuses, selectedMaterials, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: mockCollections.length,
      pending: mockCollections.filter((c) => c.status === "pending").length,
      verified: mockCollections.filter((c) => c.status === "verified").length,
      paid: mockCollections.filter((c) => c.status === "paid").length,
    };
  }, []);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "highest", label: "Highest Value" },
    { value: "lowest", label: "Lowest Value" },
  ];

  return (
    <Container>
      <Section>
        <PageHeader
          title="My Collections"
          description="Track your waste collection history"
        />
      </Section>

      <Section spacing="sm">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[var(--warning)]">{stats.pending}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[var(--success)]">{stats.verified}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">{stats.paid}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <CollectionFilter
          onStatusFilter={setSelectedStatuses}
          onMaterialFilter={setSelectedMaterials}
          selectedStatuses={selectedStatuses}
          selectedMaterials={selectedMaterials}
        />

        {/* Sort */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            {filteredAndSortedCollections.length} collection
            {filteredAndSortedCollections.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[var(--muted-foreground)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-[var(--border)] rounded-md px-3 py-1.5 bg-[var(--background)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Collections List */}
        {filteredAndSortedCollections.length > 0 ? (
          <div className="space-y-3">
            {filteredAndSortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onClick={() => setSelectedCollection(collection)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-3" />
              <h3 className="font-semibold mb-2">No collections found</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                {selectedStatuses.length > 0 || selectedMaterials.length > 0
                  ? "Try adjusting your filters"
                  : "Start collecting waste to see your history"}
              </p>
              <Button variant="primary" onClick={() => window.location.href = "/submit"}>
                Submit Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </Section>

      {/* Collection Detail Modal */}
      {selectedCollection && (
        <CollectionDetail
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}
    </Container>
  );
}
