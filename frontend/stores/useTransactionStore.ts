import { create } from "zustand";

export interface Transaction {
  id: string;
  hash?: string;
  recipientAddress: string;
  recipientHandle?: string;
  recipientName?: string;
  amount: string;
  rawAmountWei?: string;
  tokenSymbol: string;
  tokenAddress?: string;
  decimals?: number;
  usdValue?: string;
  note?: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
  gasUsed?: string;
  gasFee?: string;
  blockNumber?: number;
  error?: string;
}

interface TransactionState {
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  addTransaction: (
    tx: Omit<Transaction, "id" | "timestamp" | "status">,
  ) => string;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  markTransactionConfirmed: (id: string, hash: string, receipt?: any) => void;
  markTransactionFailed: (id: string, error: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getPendingTransactions: () => Transaction[];
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  pendingTransactions: [],
  isLoading: false,
  error: null,

  addTransaction: (txData) => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transaction: Transaction = {
      id,
      ...txData,
      status: "pending",
      timestamp: new Date(),
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      pendingTransactions: [transaction, ...state.pendingTransactions],
    }));

    return id;
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx,
      ),
      pendingTransactions: state.pendingTransactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx,
      ),
    }));
  },

  markTransactionConfirmed: (id, hash, receipt) => {
    const updates: Partial<Transaction> = {
      status: "confirmed" as const,
      hash,
      gasUsed: receipt?.gasUsed?.toString(),
      blockNumber: receipt?.blockNumber,
    };

    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx,
      ),
      pendingTransactions: state.pendingTransactions.filter(
        (tx) => tx.id !== id,
      ),
    }));
  },

  markTransactionFailed: (id, error) => {
    const updates: Partial<Transaction> = {
      status: "failed" as const,
      error,
    };

    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx,
      ),
      pendingTransactions: state.pendingTransactions.filter(
        (tx) => tx.id !== id,
      ),
    }));
  },

  getTransactionById: (id) => {
    return get().transactions.find((tx) => tx.id === id);
  },

  getPendingTransactions: () => {
    return get().pendingTransactions;
  },

  clearError: () => {
    set({ error: null });
  },
}));
