import { ethers } from "ethers";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";
import { PROVIDER_URL } from "../utils/constants";

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

export const TransactionService = {
  estimateTransaction: async (toAddress: string, amountEth: string) => {
    try {
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;

      if (!gasPrice) throw new Error("Could not fetch gas price");

      const estimatedGas = await provider.estimateGas({
        to: toAddress,
        value: ethers.parseEther(amountEth),
      });

      const totalFeeWei = estimatedGas * gasPrice;

      return {
        estimatedFee: ethers.formatEther(totalFeeWei),
      };
    } catch (error) {
      console.error("Gas estimation failed", error);
      throw new Error("Could not estimate gas. Address might be invalid.");
    }
  },

  sendTransaction: async (
    toAddress: string,
    amountEth: string,
    symbol: string = "ETH"
  ) => {
    const privateKey = await SecureStore.getItemAsync("auth_private_key");
    if (!privateKey) throw new Error("Wallet not found on device");

    const wallet = new ethers.Wallet(privateKey, provider);
    const amountWei = ethers.parseEther(amountEth);

    const txResponse = await wallet.sendTransaction({
      to: toAddress,
      value: amountWei,
    });

    console.log("Broadcasted Tx:", txResponse.hash);

    try {
      await api.post("/transaction/sync", {
        txHash: txResponse.hash,
        receiverAddress: toAddress,
        amount: amountEth,
        rawAmountWei: amountWei.toString(),
        assetSymbol: symbol,
        category: "transfer",
      });
    } catch (apiError) {
      console.warn("Backend sync failed, but tx sent:", apiError);
    }

    return txResponse;
  },
};
