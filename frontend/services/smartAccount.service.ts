import { useSmartAccountClient, useUser } from "@account-kit/react-native";
import { parseEther, parseUnits, encodeFunctionData } from "viem";

// ERC-20 ABI for transfer function
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export interface SendTransactionParams {
  recipientAddress: string;
  amount: string;
  tokenSymbol: string;
  tokenAddress?: string;
  decimals?: number;
}

export interface TransactionResult {
  hash: string; // This is the actual mined transaction hash
  success: boolean;
}

export class SmartAccountService {
  private client: any;
  private user: any;

  constructor(client: any, user: any) {
    this.client = client;
    this.user = user;
  }

  /**
   * Sends a UserOperation and waits for the actual transaction hash.
   *
   * sendUserOperation() returns a UserOperation hash (NOT a tx hash).
   * We must call waitForUserOperationTransaction() to get the real
   * mined transaction hash that can be looked up on-chain.
   */
  private async sendAndWaitForTxHash(uo: {
    target: `0x${string}`;
    value: bigint;
    data: `0x${string}` | string;
  }): Promise<string> {
    // Step 1: Send the UserOperation (gas sponsorship is handled automatically
    // by the client via gasManagerConfig.policyId set in createConfig)
    const { hash: userOpHash } = await this.client.sendUserOperation({ uo });

    // Step 2: Wait for the UserOp to be bundled into an actual transaction
    // This returns the real on-chain transaction hash
    const txHash = await this.client.waitForUserOperationTransaction({
      hash: userOpHash,
    });

    return txHash;
  }

  async sendETH(
    recipientAddress: string,
    amount: string,
  ): Promise<TransactionResult> {
    if (!this.client) {
      throw new Error("Smart account client not available");
    }

    try {
      const txHash = await this.sendAndWaitForTxHash({
        target: recipientAddress as `0x${string}`,
        value: parseEther(amount),
        data: "0x",
      });

      return { hash: txHash, success: true };
    } catch (error: any) {
      console.error("ETH transfer failed:", error);
      throw new Error(error.message || "ETH transfer failed");
    }
  }

  async sendToken(
    recipientAddress: string,
    amount: string,
    tokenAddress: string,
    decimals: number = 6,
  ): Promise<TransactionResult> {
    if (!this.client) {
      throw new Error("Smart account client not available");
    }

    try {
      const parsedAmount = parseUnits(amount, decimals);

      const transferData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipientAddress as `0x${string}`, parsedAmount],
      });

      const txHash = await this.sendAndWaitForTxHash({
        target: tokenAddress as `0x${string}`,
        value: 0n,
        data: transferData,
      });

      return { hash: txHash, success: true };
    } catch (error: any) {
      console.error("Token transfer failed:", error);
      throw new Error(error.message || "Token transfer failed");
    }
  }

  async sendTransaction(
    params: SendTransactionParams,
  ): Promise<TransactionResult> {
    const { recipientAddress, amount, tokenSymbol, tokenAddress, decimals } =
      params;

    if (!recipientAddress || !amount || !tokenSymbol) {
      throw new Error("Missing required transaction parameters");
    }

    if (parseFloat(amount) <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (tokenSymbol === "ETH") {
      return this.sendETH(recipientAddress, amount);
    } else {
      if (!tokenAddress) {
        throw new Error(`Token address required for ${tokenSymbol} transfers`);
      }
      return this.sendToken(recipientAddress, amount, tokenAddress, decimals);
    }
  }

  /**
   * Get the smart account address (where funds live).
   */
  getSmartAccountAddress(): string | undefined {
    return this.client?.account?.address;
  }
}

// Hook to get smart account service instance
export const useSmartAccountService = () => {
  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });
  const user = useUser();

  if (!client || !user) {
    return null;
  }

  return new SmartAccountService(client, user);
};
