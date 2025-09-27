import { create } from 'zustand';

export interface BalanceTransaction {
  id: number;
  userId: number;
  amount: number;
  type: 'RECHARGE' | 'DEDUCTION';
  createdAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  balance: number;
  createdAt: string;
}

interface UserState {
  profile: UserProfile | null;
  balanceTransactions: BalanceTransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setBalanceTransactions: (transactions: BalanceTransaction[]) => void;
  addBalanceTransaction: (transaction: BalanceTransaction) => void;
  updateBalance: (balance: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshProfile: () => void;
  refreshBalance: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  balanceTransactions: [],
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile }),
  
  updateProfile: (updates) => set((state) => ({
    profile: state.profile ? { ...state.profile, ...updates } : null,
  })),

  setBalanceTransactions: (transactions) => set({ balanceTransactions: transactions }),
  
  addBalanceTransaction: (transaction) => set((state) => ({
    balanceTransactions: [transaction, ...state.balanceTransactions],
  })),

  updateBalance: (balance) => set((state) => ({
    profile: state.profile ? { ...state.profile, balance } : null,
  })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  refreshProfile: () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    // This will be called by the API service
  },

  refreshBalance: () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    // This will be called by the API service
  },
}));
