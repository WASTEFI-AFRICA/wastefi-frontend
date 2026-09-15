import { create } from "zustand";
import type { Wallet, Transaction } from "@/types/api";

/**
 * Wallet Store
 * Manages wallet balance and transaction history
 */

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface WalletActions {
  setWallet: (wallet: Wallet) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (newBalance: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type WalletStore = WalletState & WalletActions;

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletStore>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  setWallet: (wallet) => {
    set({ wallet, error: null });
  },

  setTransactions: (transactions) => {
    set({ transactions, error: null });
  },

  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  updateBalance: (newBalance) => {
    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance: newBalance }
        : null,
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));
