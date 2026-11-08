import { APIError } from "./client";

export type CollectionScope =
  | { mode: "platform"; point: null }
  | { mode: "assigned_point"; point: { id: string; name: string } };

export function readCollectionScope(value: unknown): CollectionScope {
  if (!value || typeof value !== "object")
    throw new Error("Collection scope is unavailable");
  const scope = value as Record<string, unknown>;
  if (scope.mode === "platform" && scope.point === null)
    return { mode: "platform", point: null };
  if (
    scope.mode === "assigned_point" &&
    scope.point &&
    typeof scope.point === "object"
  ) {
    const point = scope.point as Record<string, unknown>;
    if (typeof point.id === "string" && typeof point.name === "string")
      return {
        mode: "assigned_point",
        point: { id: point.id, name: point.name },
      };
  }
  throw new Error("Collection scope is unavailable");
}

export function collectionAccessMessage(error: unknown): string | null {
  if (
    !(error instanceof APIError) ||
    !error.data ||
    typeof error.data !== "object"
  )
    return null;
  const code: unknown = (error.data as Record<string, unknown>).code;
  if (code === "COLLECTION_POINT_REQUIRED")
    return "No collection point is assigned to your account. Ask an administrator to assign you, then refresh.";
  if (code === "COLLECTION_POINT_INACTIVE")
    return "Your collection point is inactive. Contact an administrator, then refresh.";
  if (code === "COLLECTION_POINT_FORBIDDEN")
    return "You can only access your assigned collection point.";
  return null;
}
