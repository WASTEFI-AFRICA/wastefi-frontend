import { create } from "zustand";

/**
 * UI Store
 * Manages global UI state (modals, toasts, loading states)
 */

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface UIState {
  isOnline: boolean;
  isSidebarOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];
  isGlobalLoading: boolean;
}

interface UIActions {
  setOnline: (isOnline: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (message: string, type: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  setGlobalLoading: (isLoading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isOnline: true,
  isSidebarOpen: false,
  activeModal: null,
  toasts: [],
  isGlobalLoading: false,

  // Actions
  setOnline: (isOnline) => {
    set({ isOnline });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  openModal: (modalId) => {
    set({ activeModal: modalId });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  addToast: (message, type, duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setGlobalLoading: (isGlobalLoading) => {
    set({ isGlobalLoading });
  },
}));
