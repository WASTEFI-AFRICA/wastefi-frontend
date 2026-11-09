/**
 * Public API: endpoints that need no login, used by the /stats page.
 *
 * These use fetch directly rather than the shared axios client, which attaches a
 * stored auth token and is meant for signed-in screens.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

/** The API's origin without the /api/v1 suffix, for endpoints like /health. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api(\/v\d+)?\/?$/, "");

export interface PublicStats {
  generatedAt: string;
  currency: string;
  totals: {
    activeCollectors: number;
    activeCollectionPoints: number;
    collectionsRecorded: number;
    collectionsVerified: number;
    verifiedWeightKg: number;
    verifiedValue: number;
  };
  byMaterial: Array<{ materialType: string; collections: number; weightKg: number }>;
  recentVerified: Array<{
    materialType: string;
    weightKg: number;
    city: string;
    verifiedAt: string;
    /** The Stellar transaction that paid it, once it has been paid on-chain. */
    onChainTxHash: string | null;
  }>;
  /** Collections recorded and paid on the Soroban contracts. */
  onChain?: {
    network: string;
    /** New work only; older collections retain their saved verification flow. */
    verificationFlow?: "admin_v1" | "point_owner_v1" | null;
    /** How new payouts are created; older APIs omit it. */
    payoutMode?: "caller_amount_v1" | "derived_v1" | null;
    explorerUrl: string;
    collectionsPaid: number;
    /** WASTE minted to collectors, in whole tokens. */
    wasteMinted: number;
  };
}

export interface HealthStatus {
  status: string;
  database?: string;
  environment?: string;
  stellar?: string;
  timestamp?: string;
}

export interface PublicCollectionPoint {
  id: string;
  name: string;
  city: string;
  address: string;
  country: string;
  description: string | null;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string | null;
  operatingHours: string | null;
  acceptedMaterials: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`${url} responded with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchPublicStats(signal?: AbortSignal): Promise<PublicStats> {
  const body = await getJson<{ data: PublicStats }>(`${API_BASE_URL}/public/stats`, signal);
  return body.data;
}

export async function fetchHealth(signal?: AbortSignal): Promise<HealthStatus> {
  return getJson<HealthStatus>(`${API_ORIGIN}/health`, signal);
}

export async function fetchCollectionPoints(signal?: AbortSignal): Promise<PublicCollectionPoint[]> {
  const points: PublicCollectionPoint[] = [];
  for (let page = 1; ; page += 1) {
    const body = await getJson<{
      data: PublicCollectionPoint[] | { collectionPoints: PublicCollectionPoint[] };
      pagination?: { hasNextPage: boolean };
    }>(`${API_BASE_URL}/collection-points?limit=100&page=${page}`, signal);
    const batch = Array.isArray(body.data) ? body.data : body.data.collectionPoints;
    points.push(...batch);
    if (!body.pagination?.hasNextPage || batch.length === 0) return points;
  }
}

export interface MaterialPrice {
  /** The code the API uses, for example PET or ALUMINUM. */
  materialType: string;
  category: string;
  description: string;
  pricePerKg: number;
}

/** The materials the API accepts and what it pays for each. */
export async function fetchMaterials(
  signal?: AbortSignal
): Promise<{ currency: string; materials: MaterialPrice[] }> {
  const body = await getJson<{ data: { currency: string; materials: MaterialPrice[] } }>(
    `${API_BASE_URL}/public/materials`,
    signal
  );
  return body.data;
}

export const PUBLIC_STATS_URL = `${API_BASE_URL}/public/stats`;
export const HEALTH_URL = `${API_ORIGIN}/health`;
