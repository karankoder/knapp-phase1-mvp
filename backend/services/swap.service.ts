import axios from "axios";
import { ErrorHandler } from "../utils/errorHandler";
import {
  ZEROX_API_KEY,
  ZEROX_BASE_URL,
  ZEROX_CHAIN_ID,
} from "../utils/constants";

class SwapService {
  constructor(
    private readonly baseUrl: string,
    private readonly chainId: number,
    private readonly apiKey?: string
  ) {}

  /**
   * Fetches a swap quote (indicative price and calldata).
   */
  public async getQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    taker: string
  ) {
    try {
      const headers: Record<string, string> = {
        "0x-version": "v2",
      };

      if (this.apiKey) {
        headers["0x-api-key"] = this.apiKey;
      }

      const response = await axios.get(
        `${this.baseUrl}/swap/allowance-holder/quote`,
        {
          headers,
          params: {
            chainId: this.chainId,
            sellToken,
            buyToken,
            sellAmount,
            taker,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("0x API Error:", error.response?.data || error.message);

      if (axios.isAxiosError(error) && error.response) {
        throw new ErrorHandler(
          `Swap Quote Failed: ${
            error.response.data.reason || "External API Error"
          }`,
          error.response.status
        );
      }
      throw new ErrorHandler("Failed to contact Swap Provider", 502);
    }
  }
}

export const swapService = new SwapService(
  ZEROX_BASE_URL,
  ZEROX_CHAIN_ID,
  ZEROX_API_KEY
);
