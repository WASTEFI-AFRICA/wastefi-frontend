import { api } from "./client";
import type { ApiCollection } from "./collections";
import { formatWasteUnits } from "@/lib/wallet";

export interface WasteBalance {
  /** The collector's Stellar address, or null before their wallet is set up. */
  address: string | null;
  /** Base units (7 decimals), as a string because it can exceed 2^53. */
  balance: string;
  explorerUrl: string | null;
}

/** The signed-in user's WASTE balance, read from the token contract by the API. */
export async function getWasteBalance(signal?: AbortSignal): Promise<WasteBalance> {
  const body = await api.get<{ data: WasteBalance }>("/wallet/waste", { signal });
  if (formatWasteUnits(body.data.balance) === null) {
    throw new Error("The API returned an invalid WASTE balance");
  }
  return body.data;
}

interface CollectionPage {
  data: ApiCollection[];
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
}

/** Load every page so older rewards are included. Never return a partial history. */
export async function listWalletCollections(signal?: AbortSignal): Promise<ApiCollection[]> {
  const collections = new Map<string, ApiCollection>();
  const limit = 100;
  let expectedTotal: number | undefined;
  for (let page = 1; ; page += 1) {
    const body = await api.get<CollectionPage>("/collections/me", { params: { page, limit }, signal });
    const pagination = body.pagination;
    if (!Array.isArray(body.data) || !pagination || pagination.page !== page ||
      pagination.limit !== limit || !Number.isSafeInteger(pagination.total) || pagination.total < 0 ||
      pagination.totalPages !== Math.ceil(pagination.total / limit) ||
      pagination.hasNextPage !== (page < pagination.totalPages)) {
      throw new Error("The API returned incomplete collection history");
    }
    expectedTotal ??= pagination.total;
    if (expectedTotal !== pagination.total) {
      throw new Error("Collection history changed while loading. Refresh to try again.");
    }
    for (const collection of body.data) {
      if (!collection.id || collections.has(collection.id)) {
        throw new Error("Collection history changed while loading. Refresh to try again.");
      }
      collections.set(collection.id, collection);
    }
    if (!pagination.hasNextPage) {
      if (collections.size !== expectedTotal) throw new Error("Collection history is incomplete");
      return [...collections.values()];
    }
    if (body.data.length !== limit) throw new Error("Collection history is incomplete");
  }
}
