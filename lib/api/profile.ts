import { api } from "./client";

export interface CollectorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  address: string | null;
  city: string | null;
  country: string;
  role: "COLLECTOR" | "COLLECTION_POINT" | "VERIFIER" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

export type ProfileChanges = Pick<
  CollectorProfile,
  "firstName" | "lastName" | "email" | "address" | "city"
>;
type SavedProfile = ProfileChanges &
  Pick<CollectorProfile, "id" | "phoneNumber" | "country" | "updatedAt">;

export async function getMyProfile(
  signal?: AbortSignal,
): Promise<CollectorProfile> {
  const body = await api.get<{ data: CollectorProfile }>("/users/me", {
    signal,
  });
  return body.data;
}

export async function updateMyProfile(
  changes: ProfileChanges,
): Promise<SavedProfile> {
  const body = await api.put<{ data: SavedProfile }>("/users/me", changes);
  return body.data;
}
