import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types/api";

/**
 * Authentication Store
 * Manages the signed-in user and their tokens.
 *
 * The session is kept in sessionStorage, so it ends when the tab closes. A token
 * the API issues today is valid for days and cannot be revoked yet (see
 * wastefi-backend#36), so it should not outlive the visit on a shared device.
 * Cookies would be safer still, but the API and the frontend run on different
 * domains, where browsers increasingly block them.
 */

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** False until the stored session has been read; guards wait for it. */
  hasHydrated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string, refreshToken?: string | null) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      // Actions
      setAuth: (user, token, refreshToken = null) => {
        set({ user, token, refreshToken, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: "wastefi-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Called with the store's state once the stored session has been read.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
