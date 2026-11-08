import { api } from "./client";

export const userStatuses = {
  PENDING: "Pending activation",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  BANNED: "Banned",
} as const;
export const userRoles = {
  COLLECTOR: "Collector",
  COLLECTION_POINT: "Collection point operator",
  VERIFIER: "Verifier",
  ADMIN: "Administrator",
} as const;
export type UserStatus = keyof typeof userStatuses;
export type UserRole = keyof typeof userRoles;
export interface UserFilters {
  status: UserStatus | "";
  role: UserRole | "";
  page: number;
}
export interface AssignedPoint {
  id: string;
  name: string;
  isActive: boolean;
}
export interface AdminUser {
  collectionPoint: AssignedPoint | null;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  city: string | null;
  country: string;
  createdAt: string;
}
export interface UserPage {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const userPageSize = 10;

async function readPage(
  filters: UserFilters,
  signal?: AbortSignal,
): Promise<UserPage> {
  const body = await api.get<UserPage & { success: boolean }>("/users", {
    params: {
      page: filters.page,
      limit: userPageSize,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.role ? { role: filters.role } : {}),
    },
    signal,
  });
  const pagination = body.pagination;
  if (
    body.success !== true ||
    !pagination ||
    pagination.page !== filters.page ||
    pagination.limit !== userPageSize ||
    !Number.isSafeInteger(pagination.total) ||
    pagination.total < 0 ||
    pagination.totalPages !== Math.ceil(pagination.total / userPageSize) ||
    !Array.isArray(body.data) ||
    body.data.length > userPageSize ||
    new Set(body.data.map((user) => user?.id)).size !== body.data.length ||
    !body.data.every(
      (user) =>
        user &&
        typeof user.id === "string" &&
        user.id.length > 0 &&
        typeof user.firstName === "string" &&
        typeof user.lastName === "string" &&
        typeof user.phoneNumber === "string" &&
        (user.email === null || typeof user.email === "string") &&
        Object.hasOwn(userRoles, user.role) &&
        Object.hasOwn(userStatuses, user.status) &&
        (!filters.role || user.role === filters.role) &&
        (!filters.status || user.status === filters.status) &&
        (user.city === null || typeof user.city === "string") &&
        typeof user.country === "string" &&
        (user.collectionPoint === null || validPoint(user.collectionPoint)) &&
        typeof user.createdAt === "string" &&
        Number.isFinite(Date.parse(user.createdAt)),
    )
  ) {
    throw new Error("The user list could not be read");
  }
  return { data: body.data, pagination };
}

export async function getAdminUsers(
  filters: UserFilters,
  signal?: AbortSignal,
): Promise<UserPage> {
  const result = await readPage(filters, signal);
  // Activations or another administrator can remove the last row on a page.
  const lastPage = Math.max(1, result.pagination.totalPages);
  return filters.page > lastPage
    ? readPage({ ...filters, page: lastPage }, signal)
    : result;
}

export async function activateUser(userId: string): Promise<void> {
  const body = await api.put<{
    success: boolean;
    data: { id: string; status: string };
  }>(`/users/${encodeURIComponent(userId)}/status`, { status: "ACTIVE" });
  if (
    body.success !== true ||
    body.data?.id !== userId ||
    body.data.status !== "ACTIVE"
  ) {
    throw new Error("Account activation could not be confirmed");
  }
}

function validPoint(value: unknown): value is AssignedPoint {
  if (!value || typeof value !== "object") return false;
  const point = value as Record<string, unknown>;
  return (
    typeof point.id === "string" &&
    typeof point.name === "string" &&
    typeof point.isActive === "boolean"
  );
}

export async function getAssignablePoints(
  signal?: AbortSignal,
): Promise<AssignedPoint[]> {
  const points: AssignedPoint[] = [];
  let expectedTotal: number | undefined;
  for (let page = 1; ; page++) {
    const body = await api.get<{
      data: AssignedPoint[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>("/collection-points", { params: { page, limit: 100 }, signal });
    const meta = body.pagination;
    if (
      !meta ||
      meta.page !== page ||
      meta.limit !== 100 ||
      !Number.isSafeInteger(meta.total) ||
      meta.total < 0 ||
      meta.totalPages !== Math.ceil(meta.total / 100) ||
      !Array.isArray(body.data) ||
      body.data.some((point) => !validPoint(point) || !point.isActive)
    )
      throw new Error("Collection points could not be read");
    expectedTotal ??= meta.total;
    if (meta.total !== expectedTotal)
      throw new Error("Collection points changed while loading");
    points.push(...body.data);
    if (page >= meta.totalPages) {
      if (
        points.length !== expectedTotal ||
        new Set(points.map((point) => point.id)).size !== points.length
      )
        throw new Error("Collection point list is incomplete");
      return points;
    }
    if (body.data.length !== 100)
      throw new Error("Collection point list is incomplete");
  }
}

export async function assignPoint(
  userId: string,
  pointId: string | null,
): Promise<AssignedPoint | null> {
  const body = await api.put<{
    success: boolean;
    data: { id: string; collectionPoint: AssignedPoint | null };
  }>(`/users/${encodeURIComponent(userId)}/collection-point`, {
    collectionPointId: pointId,
  });
  if (
    body.success !== true ||
    body.data?.id !== userId ||
    (pointId === null
      ? body.data.collectionPoint !== null
      : !validPoint(body.data.collectionPoint) ||
        body.data.collectionPoint.id !== pointId)
  )
    throw new Error("Assignment could not be confirmed");
  return body.data.collectionPoint;
}
