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
  }>;
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
  const body = await getJson<{ data: unknown }>(`${API_BASE_URL}/collection-points`, signal);
  const data = body.data as { collectionPoints?: PublicCollectionPoint[] } | PublicCollectionPoint[];
  return Array.isArray(data) ? data : (data.collectionPoints ?? []);
}

export const PUBLIC_STATS_URL = `${API_BASE_URL}/public/stats`;
export const HEALTH_URL = `${API_ORIGIN}/health`;
