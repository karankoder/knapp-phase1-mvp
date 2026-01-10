import { useRouter } from "expo-router";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import ActionButton from "../../components/homeScreen/ActionButton";
import { BalanceReveal } from "../../components/homeScreen/BalanceReveal";
import { EmptyAssetCard } from "../../components/homeScreen/EmptyAssetCard";
import { RecentActivity } from "../../components/homeScreen/RecentActivity";
import { ScreenWrapper } from "../../components/ScreenWrapper";
import { ShareModal } from "../../components/homeScreen/ShareModal";
import { WeeklyInsights } from "../../components/weeklyInsights/WeeklyInsights";
import { useWallet } from "@/hooks/useWallet";

export default function HomeTab() {
  const router = useRouter();
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { assets, totals, isLoading } = useWallet();

  const isAssetEmpty = assets.length === 0 || totals.balance === 0;

  const changeSymbol = totals.changeAmount >= 0 ? "+" : "-";
  const formattedChangeAmount = `${changeSymbol}$${Math.abs(totals.changeAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedChangePercent = `${totals.changePercentage.toFixed(2)}%`;

  const handleSend = () => {
    router.push("/send");
  };

  const handleReceive = () => {
    setShareModalOpen(true);
  };

  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isBalanceRevealed ? 180 : 100 }}
      >
        <BalanceReveal
          balance={totals.balance}
          changeAmount={formattedChangeAmount}
          changePercentage={formattedChangePercent}
          onRevealChange={setIsBalanceRevealed}
        >
          <View className="flex-row gap-4 mb-10">
            <ActionButton
              icon={<ArrowDownLeft size={20} color="#ffe066" />}
              label="RECEIVE"
              onPress={handleReceive}
            />
            <ActionButton
              icon={<ArrowUpRight size={20} color="#ffe066" />}
              label="SEND"
              onPress={handleSend}
            />
          </View>

          {isAssetEmpty ? (
            <View className="mb-6">
              <EmptyAssetCard onDeposit={handleReceive} />
            </View>
          ) : (
            <View className="mb-6">
              <WeeklyInsights />
            </View>
          )}

          <RecentActivity />
        </BalanceReveal>
      </ScrollView>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </ScreenWrapper>
  );
}
