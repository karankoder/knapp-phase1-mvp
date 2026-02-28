import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { ShareModal } from "../../components/homeScreen/ShareModal";
import { WeeklyInsights } from "../../components/homeScreen/WeeklyInsights";
import { QuickSendBar } from "../../components/homeScreen/QuickSendBar";
import { BalanceRevealSection } from "../../components/homeScreen/BalanceRevealSection";
import { ActionButtons } from "../../components/homeScreen/ActionButtons";
import { ActivityList } from "../../components/homeScreen/ActivityList";
import {
  useTransactionHistoryStore,
  DisplayTransaction,
} from "@/stores/useTransactionHistoryStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Contact } from "@/stores/useContactStore";
import { useState } from "react";
import { ACTIVITY_LIMIT } from "@/utils/constants";

export default function HomeTab() {
  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { displayHistory, isLoading, fetchHistory } =
    useTransactionHistoryStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const recentActivity = useMemo(
    () => displayHistory.slice(0, ACTIVITY_LIMIT),
    [displayHistory],
  );

  const handleTransactionPress = (transaction: DisplayTransaction) => {
    router.push({
      pathname: "/transaction-detail",
      params: {
        id: transaction.id,
        name: transaction.counterparty.name,
        address: transaction.counterparty.address || "",
        amount: transaction.formattedAmount,
        date: transaction.displayDate,
        type: transaction.type,
        category: transaction.category || "",
        note: transaction.userNote || "",
        isInApp: transaction.isInApp.toString(),
      },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#000000" }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6">
          <BalanceRevealSection>
            <View className="mt-4">
              <View className="mb-7">
                <QuickSendBar />
              </View>

              <ActionButtons
                onReceive={() => setShareModalOpen(true)}
                onSend={() => router.push("/send")}
              />

              <View className="mb-6">
                <WeeklyInsights />
              </View>

              <ActivityList
                transactions={recentActivity}
                isLoading={isLoading}
                onTransactionPress={handleTransactionPress}
              />
            </View>
          </BalanceRevealSection>
        </View>
      </ScrollView>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </View>
  );
}
