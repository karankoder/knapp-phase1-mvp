import { useState, useEffect } from "react";
import { WalletService } from "../services/wallet.service";

const COIN_MAP: Record<string, string> = {
  ETH: "ethereum",
  BTC: "bitcoin",
  SOL: "solana",
};

export interface CoinAsset {
  symbol: string;
  name: string;
  balance: string;
  rawBalance: string;
  priceUsd: number;
  value: string;
}

export const useWallet = () => {
  const [assets, setAssets] = useState<CoinAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [portfolioData, priceData] = await Promise.all([
          WalletService.getPortfolio(),
          WalletService.getPrices("ethereum"),
        ]);

        if (isMounted) {
          const mergedAssets = portfolioData.map((item) => {
            const coinId = COIN_MAP[item.asset] || "ethereum";
            const price = priceData[coinId]?.usd || 0;
            const totalValue = item.balance * price;

            return {
              symbol: item.asset,
              name: item.asset === "ETH" ? "Ethereum" : item.asset,
              balance: item.balance.toFixed(4),
              rawBalance: item.rawBalance,
              priceUsd: price,
              value: `$${totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
            };
          });

          setAssets(mergedAssets);
        }
      } catch (error) {
        console.error("Failed to load wallet data", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { assets, isLoading };
};
