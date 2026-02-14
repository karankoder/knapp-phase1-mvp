import { View, Text } from "react-native";
import { TransactionItem } from "./TransactionItem";
import { ActivitySkeleton } from "../homeScreen/ActivitySkeleton";
import { COLORS } from "@/utils/constants";
import { DisplayTransaction } from "@/stores/useTransactionHistoryStore";

interface TransactionsTabProps {
  transactions: DisplayTransaction[];
  onTransactionClick: (tx: DisplayTransaction) => void;
  isLoading?: boolean;
}

export function TransactionsTab({
  transactions,
  onTransactionClick,
  isLoading = false,
}: TransactionsTabProps) {
  if (isLoading) {
    return <ActivitySkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <View className="py-16 items-center">
        <Text className="text-white/40 text-center">No transactions yet</Text>
        <Text className="text-white/30 text-sm text-center mt-2">
          Your transaction history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View>
      {transactions.map((tx, index) => (
        <TransactionItem
          key={tx.id}
          transaction={tx}
          index={index}
          onPress={onTransactionClick}
        />
      ))}
    </View>
  );
}
