import { create } from "zustand";
import { WalletService } from "@/services/wallet.service";
import { DEFAULT_ASSETS } from "@/utils/constants";

export interface Token {
  symbol: string;
  name: string;
  contractAddress?: string;
  balance: string;
  balanceWei?: string;
  usdValue: string;
  decimals: number;
  logoUrl?: string;
}

export interface WalletState {
  address?: string;
  smartAccountAddress?: string;
  assets: Token[];
  isLoadingBalances: boolean;
  lastUpdated?: Date;
  networkName: string;
  chainId: number;
  balanceError: string | null;

  setWalletAddress: (address: string, smartAccountAddress?: string) => void;
  updateTokenBalances: (tokens: Token[]) => void;
  refreshBalances: () => Promise<void>;
  getAssetBySymbol: (symbol: string) => Token | undefined;
  getTotalUSDValue: () => number;
  setBalanceError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  assets: [...DEFAULT_ASSETS],
  isLoadingBalances: false,
  networkName: "Base Sepolia",
  chainId: 84532,
  balanceError: null,

  setWalletAddress: (address: string, smartAccountAddress?: string) => {
    set({
      address,
      smartAccountAddress,
      balanceError: null,
    });
  },

  updateTokenBalances: (tokens: Token[]) => {
    const updatedAssets = get().assets.map((asset) => {
      const loadedToken = tokens.find((t) => t.symbol === asset.symbol);
      return loadedToken || asset;
    });

    set({
      assets: updatedAssets,
      lastUpdated: new Date(),
      isLoadingBalances: false,
      balanceError: null,
    });
  },

  refreshBalances: async () => {
    const { smartAccountAddress } = get();

    if (!smartAccountAddress) {
      set({ balanceError: "No smart account address available" });
      return;
    }

    set({ isLoadingBalances: true, balanceError: null });

    try {
      const tokens = await WalletService.getWalletBalances(smartAccountAddress);
      get().updateTokenBalances(tokens);
    } catch (error: any) {
      console.error("Failed to refresh balances from blockchain:", error);
      set({
        balanceError:
          error.message || "Failed to load balances from blockchain",
        isLoadingBalances: false,
      });
    }
  },

  getAssetBySymbol: (symbol: string): Token | undefined => {
    return get().assets.find((asset) => asset.symbol === symbol);
  },

  getTotalUSDValue: (): number => {
    return get().assets.reduce((total, token) => {
      const usdValue = parseFloat(token.usdValue.replace(/[$,]/g, "")) || 0;
      return total + usdValue;
    }, 0);
  },

  setBalanceError: (error: string | null) => {
    set({ balanceError: error });
  },
}));
