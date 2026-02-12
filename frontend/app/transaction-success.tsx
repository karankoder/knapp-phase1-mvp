import { ActionButtons } from "@/components/transaction/ActionButtons";
import { ProofCardModal } from "@/components/transaction/ProofCardModal";
import { ShieldIcon } from "@/components/transaction/ShieldIcon";
import { TransactionReceipt } from "@/components/transaction/TransactionReceipt";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, Share, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/utils/constants";

export default function TransactionSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { getTransactionById } = useTransactionStore();
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Get transaction data from store using the ID from params
  const transactionId = params.transactionId as string;
  const transaction = transactionId ? getTransactionById(transactionId) : null;

  // Fallback data from URL params if transaction not found in store
  const transactionData = transaction
    ? {
        amount: transaction.amount,
        coin: transaction.tokenSymbol,
        recipient: {
          name:
            transaction.recipientName ||
            transaction.recipientHandle ||
            "Unknown",
          handle: transaction.recipientHandle || "",
          avatar: transaction.recipientName?.slice(0, 2).toUpperCase() || "UN",
        },
        usdValue: transaction.usdValue?.replace("$", "") || "0.00",
        txHash: transaction.hash || (params.hash as string) || "",
        networkFee: transaction.gasFee || "0.00",
        timestamp: transaction.timestamp.toISOString(),
        status: transaction.status,
      }
    : {
        amount: (params.amount as string) || "0",
        coin: (params.token as string) || "ETH",
        recipient: {
          name: (params.recipient as string) || "Unknown",
          handle: (params.recipient as string) || "",
          avatar:
            (params.recipient as string)?.slice(0, 2).toUpperCase() || "UN",
        },
        usdValue: "0.00",
        txHash: (params.hash as string) || "",
        networkFee: "0.00",
        timestamp: new Date().toISOString(),
        status: "pending" as const,
      };

  // Show loading if no transaction data available
  if (!transactionData.txHash && !transactionId) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading transaction...</Text>
      </SafeAreaView>
    );
  }

  const handleShareProof = () => {
    setIsProofModalOpen(true);
  };

  const handleShareImage = async () => {
    try {
      await Share.share({
        title: "Transaction Proof",
        message: `I just sent ${transactionData.amount} ${transactionData.coin} to ${transactionData.recipient.handle} on Astrâ! 🚀`,
      });
      setIsProofModalOpen(false);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleBackToDashboard = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        <View className="h-48 items-center justify-center mb-8">
          <ShieldIcon visible={true} />
        </View>

        <TransactionReceipt
          amount={transactionData.amount}
          coin={transactionData.coin}
          recipient={transactionData.recipient}
          usdValue={transactionData.usdValue}
          txHash={transactionData.txHash}
          networkFee={transactionData.networkFee}
        />

        <ActionButtons
          onShareProof={handleShareProof}
          onBackToDashboard={handleBackToDashboard}
        />
      </ScrollView>

      <ProofCardModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        onShare={handleShareImage}
        amount={transactionData.amount}
        coin={transactionData.coin}
        recipientHandle={
          transactionData.recipient.handle || transactionData.recipient.name
        }
        transactionId={transactionData.txHash}
      />
    </SafeAreaView>
  );
}
