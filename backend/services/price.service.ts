import axios from "axios";
import { ErrorHandler } from "../utils/errorHandler";

interface PriceResponse {
  [key: string]: {
    [key: string]: number;
  };
}

class PriceService {
  private readonly baseUrl = "https://api.coingecko.com/api/v3";

  /**
   * Fetches the current price of a cryptocurrency in fiat or another token.
   * @param tokenId - The CoinGecko API ID (e.g., 'ethereum', 'bitcoin')
   * @param currency - The target currency (e.g., 'usd', 'inr')
   * @returns number - The current price
   */
  public async getTokenPrice(
    tokenId: string,
    currency: string = "usd"
  ): Promise<number> {
    try {
      const response = await axios.get<PriceResponse>(
        `${this.baseUrl}/simple/price`,
        {
          params: {
            ids: tokenId,
            vs_currencies: currency,
            x_cg_demo_api_key: process.env.COINGECKO_API_KEY,
          },
        }
      );

      if (!response.data[tokenId] || !response.data[tokenId][currency]) {
        throw new ErrorHandler(
          `Price data not found for ${tokenId} in ${currency}`,
          404
        );
      }

      return response.data[tokenId][currency];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new ErrorHandler("Token or currency not found", 404);
      }
      console.error("CoinGecko API Error:", error);
      throw new ErrorHandler("Failed to fetch price data", 502);
    }
  }
}

export const priceService = new PriceService();
