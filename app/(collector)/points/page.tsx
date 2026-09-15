"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button, Card, CardContent } from "@/components/ui";
import { MapPin, List, Map, Loader2 } from "lucide-react";
import type { CollectionPoint, MaterialType } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import { useUIStore } from "@/store/uiStore";

// Dynamic imports to avoid SSR issues with geolocation and browser APIs
const CollectionPointFilter = dynamic(
  () => import("@/components/points").then((mod) => mod.CollectionPointFilter),
  {
    ssr: false,
  }
);

const CollectionPointList = dynamic(
  () => import("@/components/points").then((mod) => mod.CollectionPointList),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </CardContent>
      </Card>
    ),
  }
);

const CollectionPointMap = dynamic(
  () => import("@/components/points").then((mod) => mod.CollectionPointMap),
  {
    ssr: false,
    loading: () => (
      <Card className="w-full" style={{ height: "400px" }}>
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </CardContent>
      </Card>
    ),
  }
);

const CollectionPointDetail = dynamic(
  () => import("@/components/points").then((mod) => mod.CollectionPointDetail),
  {
    ssr: false,
  }
);

/**
 * Collection Points Page
 * Find nearby collection points with map and list view
 */

// Mock data - Replace with API call in production
const mockCollectionPoints: CollectionPoint[] = [
  {
    id: "point-1",
    name: "Green Recycling Center",
    address: "123 Main Street, Downtown",
    location: { lat: 40.7128, lng: -74.006 },
    acceptedMaterials: ["plastic", "paper", "metal", "glass", "cardboard"],
    operatingHours: {
      open: "08:00",
      close: "18:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    contact: {
      phone: "+1234567890",
      email: "info@greenrecycling.com",
    },
    rating: 4.5,
    totalCollections: 1250,
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "point-2",
    name: "EcoHub Collection Point",
    address: "456 Oak Avenue, Midtown",
    location: { lat: 40.7589, lng: -73.9851 },
    acceptedMaterials: ["e-waste", "batteries", "plastic", "metal"],
    operatingHours: {
      open: "09:00",
      close: "17:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    contact: {
      phone: "+1234567891",
    },
    rating: 4.8,
    totalCollections: 890,
    verified: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "point-3",
    name: "Community Recycle Station",
    address: "789 Elm Street, Uptown",
    location: { lat: 40.7829, lng: -73.9654 },
    acceptedMaterials: ["paper", "cardboard", "textiles", "plastic"],
    operatingHours: {
      open: "07:00",
      close: "19:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    contact: {
      phone: "+1234567892",
      email: "help@communityrecycle.org",
    },
    rating: 4.3,
    totalCollections: 650,
    verified: true,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "point-4",
    name: "Organic Waste Hub",
    address: "321 Pine Road, Westside",
    location: { lat: 40.7358, lng: -74.0014 },
    acceptedMaterials: ["organic", "paper", "cardboard"],
    operatingHours: {
      open: "06:00",
      close: "16:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    rating: 4.6,
    totalCollections: 420,
    verified: false,
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "point-5",
    name: "Tech Waste Recycling",
    address: "555 Tech Boulevard, Innovation District",
    location: { lat: 40.7489, lng: -73.9680 },
    acceptedMaterials: ["e-waste", "batteries", "metal", "plastic"],
    operatingHours: {
      open: "10:00",
      close: "20:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    contact: {
      phone: "+1234567893",
      email: "support@techwasterecycling.com",
    },
    rating: 4.9,
    totalCollections: 1580,
    verified: true,
    createdAt: "2024-01-20T00:00:00Z",
  },
];

export default function CollectionPointsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const addToast = useUIStore((state) => state.addToast);

  // Get user location on mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { getCurrentLocation } = await import("@/lib/utils/geolocation");
      const location = await getCurrentLocation();
      setUserLocation(location);
      addToast("Location detected", "success");
    } catch (error) {
      console.error("Location error:", error);
      addToast("Unable to get your location", "error");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Filter points based on search and materials
  const filteredPoints = useMemo(() => {
    let filtered = mockCollectionPoints;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (point) =>
          point.name.toLowerCase().includes(query) ||
          point.address.toLowerCase().includes(query)
      );
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((point) =>
        selectedMaterials.some((material) =>
          point.acceptedMaterials.includes(material)
        )
      );
    }

    return filtered;
  }, [searchQuery, selectedMaterials]);

  const handlePointSelect = (point: CollectionPoint) => {
    setSelectedPoint(point);
    setShowDetail(true);
  };

  return (
    <Container>
      <Section>
        <PageHeader
          title="Collection Points"
          description="Find nearby recycling centers"
        />
      </Section>

      <Section spacing="sm">
        {/* View mode toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === "map" ? "primary" : "outline"}
              size="md"
              onClick={() => setViewMode("map")}
            >
              <Map className="w-5 h-5 mr-2" />
              Map
            </Button>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={handleGetLocation}
            loading={isLoadingLocation}
          >
            <MapPin className="w-5 h-5 mr-2" />
            {userLocation ? "Refresh" : "Get Location"}
          </Button>
        </div>

        {/* Filters */}
        <CollectionPointFilter
          onSearchChange={setSearchQuery}
          onMaterialFilter={setSelectedMaterials}
          selectedMaterials={selectedMaterials}
        />

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
          <span>
            {filteredPoints.length} point{filteredPoints.length !== 1 ? "s" : ""} found
          </span>
          {!userLocation && !isLoadingLocation && (
            <span className="text-[var(--warning)]">
              Enable location for distance info
            </span>
          )}
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <CollectionPointList
            points={filteredPoints}
            userLocation={userLocation}
            selectedPoint={selectedPoint}
            onPointSelect={handlePointSelect}
          />
        ) : (
          <CollectionPointMap
            points={filteredPoints}
            userLocation={userLocation}
            selectedPoint={selectedPoint}
            onPointSelect={handlePointSelect}
          />
        )}

        {/* Empty state */}
        {filteredPoints.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-3" />
              <h3 className="font-semibold mb-2">No points found</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Try adjusting your filters or search query
              </p>
            </CardContent>
          </Card>
        )}
      </Section>

      {/* Point detail modal */}
      {showDetail && selectedPoint && (
        <CollectionPointDetail
          point={selectedPoint}
          userLocation={userLocation}
          onClose={() => setShowDetail(false)}
        />
      )}
    </Container>
  );
}
