import axios from "axios";
import { ErrorHandler } from "../utils/errorHandler";
import prisma from "../config/prisma";
import { ethers } from "ethers";
import { RPC_URL } from "../utils/constants";

interface PriceResponse {
  [key: string]: {
    [key: string]: number;
  };
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

class WalletService {
  private readonly baseUrl = "https://api.coingecko.com/api/v3";

  /**
   * Fetches the current price of multiple cryptocurrencies.
   * @param tokenIds - Array of CoinGecko API IDs (e.g., ['bitcoin', 'ethereum'])
   * @param currency - The target currency (e.g., 'usd', 'inr')
   * @returns object - Object containing prices for requested tokens
   */
  public async getTokenPrice(
    tokenIds: string[],
    currency: string = "usd"
  ): Promise<any> {
    try {
      const idsParam = tokenIds.join(",");

      const response = await axios.get<PriceResponse>(
        `${this.baseUrl}/simple/price`,
        {
          params: {
            ids: idsParam,
            vs_currencies: currency,
            x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
          },
        }
      );

      if (Object.keys(response.data).length === 0) {
        throw new ErrorHandler(
          `No price data found for the provided tokens: ${idsParam}`,
          404
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new ErrorHandler("Token or currency not found", 404);
      }
      console.error("CoinGecko API Error:", error);
      throw new ErrorHandler("Failed to fetch price data", 502);
    }
  }

  public async getUserPortfolio(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { publicAddress: true },
    });

    if (!user || !user.publicAddress) {
      throw new ErrorHandler("User wallet not found", 404);
    }

    const balanceWei = await provider.getBalance(user.publicAddress);

    const balanceEth = ethers.formatEther(balanceWei);

    // For M1 (Base Sepolia), we only have ETH. Future updates can add ERC-20 tokens here.
    return [
      {
        asset: "ETH",
        balance: parseFloat(balanceEth),
        rawBalance: balanceWei.toString(),
        network: "Base Sepolia",
      },
    ];
  }
}

export const walletService = new WalletService();
