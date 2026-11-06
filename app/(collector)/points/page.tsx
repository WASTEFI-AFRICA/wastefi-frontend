"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { MapPin, List, Map, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button, Card, CardContent } from "@/components/ui";
import { CollectionPointFilter } from "@/components/points/CollectionPointFilter";
import { CollectionPointList } from "@/components/points/CollectionPointList";
import { CollectionPointDetail } from "@/components/points/CollectionPointDetail";
import { fetchCollectionPoints } from "@/lib/api/public";
import { toCollectionPoint } from "@/lib/api/collection-points";
import type { CollectionPoint } from "@/types/api";
import type { Coordinates } from "@/lib/utils/geolocation";
import { useToast } from "@/lib/hooks/useToast";

const CollectionPointMap = dynamic(
  () =>
    import("@/components/points/CollectionPointMap").then(
      (mod) => mod.CollectionPointMap,
    ),
  {
    ssr: false,
    loading: () => (
      <p role="status" className="p-8 text-center">
        Loading map...
      </p>
    ),
  },
);

const NO_POINTS: CollectionPoint[] = [];

export default function CollectionPointsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(
    null,
  );
  const toast = useToast();
  const {
    data: points = NO_POINTS,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["public", "collection-points"],
    queryFn: async ({ signal }) =>
      (await fetchCollectionPoints(signal)).map(toCollectionPoint),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { getCurrentLocation } = await import("@/lib/utils/geolocation");
      setUserLocation(await getCurrentLocation());
      toast.success("Location detected");
    } catch {
      toast.error("Unable to get your location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const availableMaterials = useMemo(
    () =>
      [...new Set(points.flatMap((point) => point.acceptedMaterials))].sort(),
    [points],
  );
  const filteredPoints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return points.filter(
      (point) =>
        (!query ||
          [point.name, point.address, point.city, point.country].some((value) =>
            value.toLowerCase().includes(query),
          )) &&
        (selectedMaterials.length === 0 ||
          selectedMaterials.some((material) =>
            point.acceptedMaterials.includes(material),
          )),
    );
  }, [points, searchQuery, selectedMaterials]);
  const mappedCount = filteredPoints.filter(
    (point) => point.location !== null,
  ).length;
  const handlePointSelect = useCallback(
    (point: CollectionPoint) => setSelectedPoint(point),
    [],
  );

  return (
    <Container>
      <Section>
        <PageHeader
          title="Collection Points"
          description="Find a place to deliver your sorted recyclables"
        />
      </Section>
      <Section spacing="sm" className="space-y-4">
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                className="flex gap-1 rounded-xl bg-[var(--muted)]/50 p-1 self-start"
                role="group"
                aria-label="View collection points"
              >
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4 mr-2" aria-hidden="true" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "primary" : "ghost"}
                  aria-pressed={viewMode === "map"}
                  onClick={() => setViewMode("map")}
                  className="rounded-lg"
                >
                  <Map className="w-4 h-4 mr-2" aria-hidden="true" />
                  Map
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleGetLocation}
                loading={isLoadingLocation}
                className="self-start rounded-lg"
              >
                <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                {userLocation ? "Update location" : "Use my location"}
              </Button>
            </div>
            <CollectionPointFilter
              onSearchChange={setSearchQuery}
              onMaterialFilter={setSelectedMaterials}
              selectedMaterials={selectedMaterials}
              availableMaterials={availableMaterials}
            />
          </CardContent>
        </Card>

        {isPending ? (
          <Card>
            <CardContent
              className="p-8 flex items-center justify-center gap-3 text-[var(--muted-foreground)]"
              role="status"
            >
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Loading collection points...
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <p role="alert">
                Could not load collection points. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">
                {filteredPoints.length} collection point
                {filteredPoints.length !== 1 ? "s" : ""}
              </p>
              <p>
                {userLocation
                  ? viewMode === "list"
                    ? "Nearest points first"
                    : "Your location is shown on the map"
                  : "Use your location to see distances"}
              </p>
            </div>
            {filteredPoints.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin
                    className="w-10 h-10 mx-auto mb-3 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <h2 className="font-semibold mb-2">
                    {points.length === 0
                      ? "No collection points listed yet"
                      : "No matching collection points"}
                  </h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {points.length === 0
                      ? "Check back later for active collection points."
                      : "Try another name, city or material, or clear your filters."}
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === "list" ? (
              <CollectionPointList
                points={filteredPoints}
                userLocation={userLocation}
                selectedPoint={selectedPoint}
                onPointSelect={handlePointSelect}
              />
            ) : mappedCount === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  Map coordinates are not listed for these points. You can still
                  view their details in the list.
                </CardContent>
              </Card>
            ) : (
              <>
                <CollectionPointMap
                  points={filteredPoints}
                  userLocation={userLocation}
                  selectedPoint={selectedPoint}
                  onPointSelect={handlePointSelect}
                />
                {mappedCount < filteredPoints.length && (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {mappedCount} of {filteredPoints.length} points shown on the
                    map. The others do not have valid coordinates listed.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </Section>
      {selectedPoint && (
        <CollectionPointDetail
          point={selectedPoint}
          userLocation={userLocation}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </Container>
  );
}
