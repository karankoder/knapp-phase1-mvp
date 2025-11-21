import axios from "axios";
import { ErrorHandler } from "../utils/errorHandler";
import { ZERO_EX_API_KEY } from "../utils/constants";

class SwapService {
  private readonly baseUrl = "https://api.0x.org";
  private readonly apiKey = ZERO_EX_API_KEY;

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
            chainId: "8453",
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

export const swapService = new SwapService();
