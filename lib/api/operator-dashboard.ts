import { api } from "./client";
import type { ApiCollection } from "./collections";

export interface MaterialStatistic {
  materialType: string;
  count: number;
  totalWeight: number;
}

/** Counts and weights include collections at every review stage. */
export interface CollectionStatistics {
  totalCollections: number;
  totalWeight: number;
  byMaterial: MaterialStatistic[];
}

export interface ReviewQueuePreview {
  collections: ApiCollection[];
  total: number;
}

function nonnegative(value: number): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export async function getCollectionStatistics(
  signal?: AbortSignal,
): Promise<CollectionStatistics> {
  const { data } = await api.get<{ data: CollectionStatistics }>(
    "/collections/statistics",
    { signal },
  );
  if (
    !data ||
    !Number.isSafeInteger(data.totalCollections) ||
    data.totalCollections < 0 ||
    !nonnegative(data.totalWeight) ||
    !Array.isArray(data.byMaterial) ||
    !data.byMaterial.every(
      (row) =>
        typeof row.materialType === "string" &&
        Number.isSafeInteger(row.count) &&
        row.count >= 0 &&
        nonnegative(row.totalWeight),
    )
  ) {
    throw new Error("Collection statistics could not be read");
  }
  return data;
}

/** The oldest five unreviewed records, plus the full queue count from pagination. */
export async function getReviewQueuePreview(
  signal?: AbortSignal,
): Promise<ReviewQueuePreview> {
  const body = await api.get<{
    data: ApiCollection[];
    pagination: { total: number };
  }>("/collections", {
    params: { verified: false, page: 1, limit: 5 },
    signal,
  });
  const total = body.pagination?.total;
  if (
    !Array.isArray(body.data) ||
    !Number.isSafeInteger(total) ||
    total < 0 ||
    body.data.length !== Math.min(total, 5) ||
    body.data.some(
      (row) =>
        row.verifiedAt !== null ||
        typeof row.id !== "string" ||
        typeof row.materialType !== "string" ||
        typeof row.createdAt !== "string" ||
        !nonnegative(row.weight),
    )
  ) {
    throw new Error("The review queue could not be read");
  }
  return { collections: body.data, total };
}
