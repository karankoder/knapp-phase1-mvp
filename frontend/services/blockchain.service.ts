import { createPublicClient, http, PublicClient, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

const ALCHEMY_API_KEY = process.env.EXPO_PUBLIC_ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

interface TokenContract {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

const KNOWN_TOKENS: Record<string, TokenContract> = {
  USDT: {
    address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
  },
  USDC: {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
};

export class AlchemyService {
  private client;
  private rpcURL: string;
  private pricesURL = "https://api.g.alchemy.com/prices/v1";

  constructor() {
    if (!ALCHEMY_API_KEY) {
      throw new Error("ALCHEMY_API_KEY is required");
    }

    this.rpcURL = ALCHEMY_BASE_URL;

    this.client = createPublicClient({
      chain: baseSepolia,
      transport: http(ALCHEMY_BASE_URL),
    });
  }

  async getETHBalance(
    address: `0x${string}`,
  ): Promise<{ balance: string; balanceWei: string; usdValue: string }> {
    try {
      const balanceWei = await this.client.getBalance({ address });
      const balance = parseFloat(formatUnits(balanceWei, 18));

      return {
        balance: balance.toFixed(6),
        balanceWei: balanceWei.toString(),
        usdValue: "$0.00", // Will be calculated in getAllBalances with real prices
      };
    } catch (error) {
      console.error("Failed to get ETH balance:", error);
      return { balance: "0", balanceWei: "0", usdValue: "$0.00" };
    }
  }

  /**
   * Get all balances (ETH + tokens) using viem client for ETH and direct RPC for tokens
   */
  async getAllBalances(address: `0x${string}`) {
    try {
      const ethBalancePromise = this.getETHBalance(address);

      // Direct RPC call for token balances
      const tokenBalancePromise = fetch(this.rpcURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [
            address,
            [KNOWN_TOKENS.USDT.address, KNOWN_TOKENS.USDC.address],
          ],
        }),
      }).then((res) => res.json());

      const [ethBalanceResult, tokenBalanceResponse] = await Promise.all([
        ethBalancePromise,
        tokenBalancePromise,
      ]);

      if (tokenBalanceResponse.error) {
        throw new Error(tokenBalanceResponse.error.message);
      }

      const tokenBalancesResult = tokenBalanceResponse.result;
      const usdtTokenBalance = tokenBalancesResult?.tokenBalances?.find(
        (token: any) =>
          token.contractAddress.toLowerCase() ===
          KNOWN_TOKENS.USDT.address.toLowerCase(),
      );
      const usdcTokenBalance = tokenBalancesResult?.tokenBalances?.find(
        (token: any) =>
          token.contractAddress.toLowerCase() ===
          KNOWN_TOKENS.USDC.address.toLowerCase(),
      );

      const usdtBalanceWei = BigInt(usdtTokenBalance?.tokenBalance || "0");
      const usdcBalanceWei = BigInt(usdcTokenBalance?.tokenBalance || "0");

      const usdtBalance = parseFloat(
        formatUnits(usdtBalanceWei, KNOWN_TOKENS.USDT.decimals),
      );
      const usdcBalance = parseFloat(
        formatUnits(usdcBalanceWei, KNOWN_TOKENS.USDC.decimals),
      );

      // Get prices using Alchemy Prices API
      const [ethPrice, usdtPrice, usdcPrice] = await this.getTokenPrices([
        "ETH",
        "USDT",
        "USDC",
      ]);

      return {
        ETH: {
          symbol: "ETH",
          name: "Ethereum",
          balance: ethBalanceResult.balance,
          balanceWei: ethBalanceResult.balanceWei,
          usdValue: `$${(parseFloat(ethBalanceResult.balance) * ethPrice).toFixed(2)}`,
          decimals: 18,
        },
        USDT: {
          symbol: "USDT",
          name: "Tether USD",
          balance: usdtBalance.toFixed(2),
          usdValue: `$${(usdtBalance * usdtPrice).toFixed(2)}`,
          decimals: 6,
          contractAddress: KNOWN_TOKENS.USDT.address,
        },
        USDC: {
          symbol: "USDC",
          name: "USD Coin",
          balance: usdcBalance.toFixed(2),
          usdValue: `$${(usdcBalance * usdcPrice).toFixed(2)}`,
          decimals: 6,
          contractAddress: KNOWN_TOKENS.USDC.address,
        },
      };
    } catch (error) {
      console.error("Failed to get all balances:", error);

      // Return zero balances for all tokens when blockchain calls fail
      return {
        ETH: {
          symbol: "ETH",
          name: "Ethereum",
          balance: "0.0",
          balanceWei: "0",
          usdValue: "$0.00",
          decimals: 18,
        },
        USDT: {
          symbol: "USDT",
          name: "Tether USD",
          balance: "0.00",
          usdValue: "$0.00",
          decimals: 6,
          contractAddress: KNOWN_TOKENS.USDT.address,
        },
        USDC: {
          symbol: "USDC",
          name: "USD Coin",
          balance: "0.00",
          usdValue: "$0.00",
          decimals: 6,
          contractAddress: KNOWN_TOKENS.USDC.address,
        },
      };
    }
  }

  /**
   * Get token prices using Alchemy Prices API with individual calls
   */
  private async getTokenPrices(symbols: string[]): Promise<number[]> {
    try {
      // Make individual API calls for each symbol
      const pricePromises = symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `${this.pricesURL}/tokens/by-symbol?symbols=${symbol}`,
            {
              headers: {
                Authorization: `Bearer ${ALCHEMY_API_KEY}`,
              },
            },
          );
          
          const data = await response.json();
          
          if (data.data && data.data.length > 0 && data.data[0].prices && data.data[0].prices.length > 0) {
            return parseFloat(data.data[0].prices[0].value);
          }
          
          // Return fallback price if no data
          return symbol === "ETH" ? 3000 : 1;
        } catch (error) {
          console.error(`Failed to get price for ${symbol}:`, error);
          return symbol === "ETH" ? 3000 : 1;
        }
      });
      
      return await Promise.all(pricePromises);
    } catch (error) {
      console.error("Failed to get token prices from Alchemy:", error);
      // Return fallback prices in order
      return symbols.map((symbol) => (symbol === "ETH" ? 3000 : 1));
    }
  }
}
