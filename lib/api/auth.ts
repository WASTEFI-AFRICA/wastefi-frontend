import axios from "axios";
import type { User, UserRole } from "@/types/api";

/**
 * Sign-in against the WasteFi API.
 *
 * These calls use axios directly rather than the shared client: the shared client
 * retries a 401 by refreshing the session, which must not happen for the calls that
 * create or refresh the session itself.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// The demo API runs on a free host that sleeps when idle and can take up to a
// minute to answer the first request.
const AUTH_TIMEOUT_MS = 90_000;

/** The user as the API returns it with a token. */
interface ApiUser {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: "COLLECTOR" | "COLLECTION_POINT" | "VERIFIER" | "ADMIN";
  email?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Verifiers use the collection point screens: the API gives both roles the same
// verification rights.
const ROLES: Record<ApiUser["role"], UserRole> = {
  COLLECTOR: "collector",
  COLLECTION_POINT: "collection_point",
  VERIFIER: "collection_point",
  ADMIN: "admin",
};

function toSession(data: TokenResponse): Session {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      id: data.user.id,
      phone: data.user.phoneNumber,
      name: `${data.user.firstName} ${data.user.lastName}`.trim(),
      email: data.user.email,
      role: ROLES[data.user.role],
      createdAt: new Date().toISOString(),
    },
  };
}

/** The message to show for a failed auth call. */
function describe(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Could not reach the server. Check your connection and try again.";
    }
    const body = error.response.data as
      | { message?: string; error?: string; details?: Array<{ msg?: string }> }
      | undefined;
    // Validation errors carry the useful text per field, under details
    return body?.details?.[0]?.msg || body?.message || body?.error || fallback;
  }
  return fallback;
}

export async function login(phoneNumber: string, password: string): Promise<Session> {
  try {
    const response = await axios.post<{ data: TokenResponse }>(
      `${API_BASE_URL}/auth/login`,
      { phoneNumber, password },
      { timeout: AUTH_TIMEOUT_MS }
    );
    return toSession(response.data.data);
  } catch (error) {
    throw new Error(describe(error, "Sign-in failed. Check your phone number and password."));
  }
}

export interface Registration {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
}

/** Create a collector account. Signing in is a separate step. */
export async function registerAccount(registration: Registration): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/register`,
      { ...registration, email: registration.email || undefined },
      { timeout: AUTH_TIMEOUT_MS }
    );
  } catch (error) {
    throw new Error(describe(error, "The account could not be created. Please try again."));
  }
}

/** True when sign-in failed only because the account is waiting for activation. */
export function isAwaitingActivation(message: string): boolean {
  return /not active/i.test(message);
}

/** Exchange a refresh token for a new session. Throws if the session has ended. */
export async function refreshSession(refreshToken: string): Promise<Session> {
  const response = await axios.post<{ data: TokenResponse }>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    { timeout: AUTH_TIMEOUT_MS }
  );
  return toSession(response.data.data);
}

/** Where each role lands after signing in. */
export function homePath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin-dashboard";
    case "collection_point":
      return "/verify";
    default:
      return "/dashboard";
  }
}

/** Only follow `next` links that stay inside this app. */
export function safeNextPath(next: string | null): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}
