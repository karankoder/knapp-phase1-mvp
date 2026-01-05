import { api } from "./api";

export interface PortfolioItem {
  asset: string;
  balance: number;
  rawBalance: string;
  network: string;
}

export interface PriceData {
  [coinId: string]: {
    [currency: string]: number;
  };
}

export const WalletService = {
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const { data } = await api.get<{ portfolio: PortfolioItem[] }>(
      "/wallet/portfolio"
    );
    return data.portfolio;
  },

  getPrices: async (tokens: string = "ethereum"): Promise<PriceData> => {
    const { data } = await api.get<{ data: { prices: PriceData } }>(
      `/wallet/prices?tokens=${tokens}&currency=usd`
    );
    return data.data.prices;
  },
};
