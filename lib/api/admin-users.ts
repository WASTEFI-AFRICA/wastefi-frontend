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
export interface AdminUser {
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
