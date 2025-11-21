import { JsonRpcProvider, isAddress, formatEther, parseEther } from "ethers";
import { ErrorHandler } from "../utils/errorHandler";
import { BASE_TESTNET_RPC } from "../utils/constants";
import { TransactionRequest } from "ethers";

class ProviderService {
  private provider: JsonRpcProvider;

  constructor() {
    const rpcUrl = BASE_TESTNET_RPC;

    this.provider = new JsonRpcProvider(rpcUrl);
  }

  /**
   * Validates an Ethereum address format.
   * @param address - The wallet address to check
   */
  public validateAddress(address: string): boolean {
    return isAddress(address);
  }

  /**
   * Fetches the native ETH balance of an address on Base Testnet.
   * @param address - The wallet address
   * @returns string - The balance in ETH (not Wei)
   */
  public async getNativeBalance(address: string): Promise<string> {
    if (!this.validateAddress(address)) {
      throw new ErrorHandler("Invalid Ethereum address format", 400);
    }

    try {
      const balanceWei = await this.provider.getBalance(address);
      return formatEther(balanceWei);
    } catch (error) {
      console.error("Provider Error:", error);
      throw new ErrorHandler(
        "Failed to fetch balance from blockchain provider",
        502
      );
    }
  }

  public async simulateTransaction(
    from: string,
    to: string,
    amountEther: string
  ) {
    if (!this.validateAddress(from) || !this.validateAddress(to)) {
      throw new ErrorHandler("Invalid wallet address provided", 400);
    }

    try {
      const value = parseEther(amountEther);

      const txParams: TransactionRequest = {
        from,
        to,
        value,
      };

      const gasLimit = await this.provider.estimateGas(txParams);

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);

      const estimatedCostWei = gasLimit * gasPrice;

      return {
        isPossible: true,
        gasLimit: gasLimit.toString(),
        gasPrice: formatEther(gasPrice),
        estimatedCostEth: formatEther(estimatedCostWei),
        totalRequired: formatEther(value + estimatedCostWei),
      };
    } catch (error: any) {
      console.error("Simulation Error:", error);
      throw new ErrorHandler(
        `Transaction simulation failed: ${
          error.reason || error.message || "Unknown error"
        }`,
        400
      );
    }
  }
}

export const providerService = new ProviderService();
