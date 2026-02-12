import { Token } from "../stores/useWalletStore";
import { AlchemyService } from "./blockchain.service";
import { useSmartAccountService } from "./smartAccount.service";
import {
  TransactionService,
  SendTransactionRequest,
} from "./transaction.service";

export const WalletService = {
  getWalletBalances: async (address: string): Promise<Token[]> => {
    const alchemyService = new AlchemyService();
    const balances = await alchemyService.getAllBalances(
      address as `0x${string}`,
    );

    return [balances.ETH, balances.USDT, balances.USDC].filter(
      (token) => parseFloat(token.balance) > 0,
    );
  },

  sendTransaction: async (
    transactionData: SendTransactionRequest,
    smartAccountService: any,
  ) => {
    if (!smartAccountService) {
      throw new Error("Smart account service not available");
    }

    const transactionService = new TransactionService(smartAccountService);
    return await transactionService.sendTransaction(transactionData);
  },
};
