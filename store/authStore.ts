import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api";

/**
 * Authentication Store
 * Manages user authentication state and token
 */

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user, token) => {
        // Save token to localStorage for API client
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        // Clear token from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: "wastefi-auth", // LocalStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
