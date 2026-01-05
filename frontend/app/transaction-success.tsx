import { ActionButtons } from "@/components/transaction/ActionButtons";
import { ProofCardModal } from "@/components/transaction/ProofCardModal";
import { ShieldIcon } from "@/components/transaction/ShieldIcon";
import { TransactionReceipt } from "@/components/transaction/TransactionReceipt";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Share, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const transactionData = {
    amount: (params.amount as string) || "0.00",
    coin: (params.coin as string) || "ETH",
    recipient: {
      name: (params.recipientName as string) || "Unknown",
      handle: (params.recipientHandle as string) || "",
      avatar: (params.recipientAvatar as string) || "??",
    },

    usdValue: (params.usdValue as string) || "$0.00",
    txHash: (params.txHash as string) || "",
    networkFee: (params.networkFee as string) || "0.0001",
  };

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
