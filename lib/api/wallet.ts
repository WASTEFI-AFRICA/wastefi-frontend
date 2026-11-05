import { api } from "./client";

export interface WasteBalance {
  /** The collector's Stellar address, or null before their first approval. */
  address: string | null;
  /** Base units (7 decimals), as a string because it can exceed 2^53. */
  balance: string;
  explorerUrl: string | null;
}

/** The signed-in user's WASTE balance, read from the token contract by the API. */
export async function getWasteBalance(): Promise<WasteBalance> {
  const body = await api.get<{ data: WasteBalance }>("/wallet/waste");
  return body.data;
}
