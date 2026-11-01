import { api } from "./client";
import type { MaterialType, WasteSubmission } from "@/types/api";

/**
 * Waste collections from the API, and conversion to the shapes the screens use.
 */

/** Progress of an approved collection through the Soroban contracts. */
export type ChainStatus = "PENDING" | "RECORDED" | "VERIFIED" | "PAID" | "FAILED";

/** A collection as the API returns it. */
export interface ApiCollection {
  id: string;
  collectorId: string;
  collectionPointId: string;
  materialType: string;
  materialCategory: string;
  weight: number;
  imageUrls: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentStatus: string;
  verifiedAt: string | null;
  notes: string | null;
  createdAt: string;
  chainStatus: ChainStatus | null;
  chainTransactionId: string | null;
  chainAmount: string | null;
  chainRecordTxHash: string | null;
  chainVerifyTxHash: string | null;
  chainPaymentTxHash: string | null;
  chainError: string | null;
  collector?: { firstName: string; lastName: string };
  collectionPoint?: { name: string; city: string };
}

export interface CollectionReview {
  approved: boolean;
  notes?: string;
  /** Only when the weighed amount differs; the API recalculates the payment. */
  adjustedWeight?: number;
}

/** Collections nobody has approved or rejected yet, oldest first. */
export async function listVerificationQueue(): Promise<ApiCollection[]> {
  const body = await api.get<{ data: ApiCollection[] }>("/collections", {
    params: { verified: false, limit: 100 },
  });
  return body.data;
}

export async function getCollection(id: string): Promise<ApiCollection> {
  const body = await api.get<{ data: ApiCollection }>(`/collections/${id}`);
  return body.data;
}

/** Approve or reject a collection. Approval also starts its on-chain record. */
export async function reviewCollection(id: string, review: CollectionReview): Promise<ApiCollection> {
  const body = await api.post<{ data: ApiCollection }>(`/collections/${id}/verify`, review);
  return body.data;
}

const MATERIALS: Record<string, MaterialType> = {
  plastic: "plastic",
  paper: "paper",
  cardboard: "cardboard",
  metal: "metal",
  glass: "glass",
  electronics: "e-waste",
  "e-waste": "e-waste",
  textile: "textiles",
  textiles: "textiles",
  organic: "organic",
};

function photosOf(collection: ApiCollection): string[] {
  try {
    const parsed: unknown = JSON.parse(collection.imageUrls || "[]");
    return Array.isArray(parsed) ? parsed.filter((url): url is string => typeof url === "string") : [];
  } catch {
    return [];
  }
}

/** The submission shape the verification components render. */
export function toSubmission(collection: ApiCollection): WasteSubmission {
  return {
    id: collection.id,
    collectorId: collection.collectorId,
    collectionPointId: collection.collectionPointId,
    materialType: MATERIALS[collection.materialCategory.trim().toLowerCase()] ?? "mixed",
    materialDetail: collection.materialType,
    weight: collection.weight,
    photos: photosOf(collection),
    status: collection.verifiedAt ? "verified" : "pending",
    estimatedValue: collection.paymentAmount,
    currency: collection.paymentCurrency,
    collectorName: collection.collector
      ? `${collection.collector.firstName} ${collection.collector.lastName}`.trim()
      : undefined,
    collectionPointName: collection.collectionPoint?.name,
    createdAt: collection.createdAt,
  };
}

/** WASTE has 7 decimals; the API reports amounts in base units. */
export function wasteAmount(baseUnits: string | null): number | null {
  if (!baseUnits) return null;
  return Number(BigInt(baseUnits)) / 10_000_000;
}
