import { useState, useMemo } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { SearchBar } from "@/components/activity/SearchBar";
import { ContactsTab } from "@/components/activity/ContactsTab";
import { TransactionsTab } from "@/components/activity/TransactionsTab";
import { TabSwitcher } from "@/components/activity/TabSwitcher";
import { COLORS } from "@/utils/constants";
import { useTransactionHistoryStore } from "@/stores/useTransactionHistoryStore";

type ActivityTab = "transactions" | "contacts";

export default function Activity() {
  const router = useRouter();
  const [activityTab, setActivityTab] = useState<ActivityTab>("transactions");
  const [searchQuery, setSearchQuery] = useState("");

  const { displayHistory, contactThreads, isLoading } =
    useTransactionHistoryStore();

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return displayHistory;
    const query = searchQuery.toLowerCase();
    return displayHistory.filter(
      (tx) =>
        tx.counterparty.name.toLowerCase().includes(query) ||
        tx.userNote?.toLowerCase().includes(query) ||
        tx.formattedAmount.toLowerCase().includes(query),
    );
  }, [searchQuery, displayHistory]);

  const filteredContactThreads = useMemo(() => {
    if (!searchQuery.trim()) return contactThreads;
    const query = searchQuery.toLowerCase();
    return contactThreads.filter(
      (thread) =>
        thread.displayName.toLowerCase().includes(query) ||
        thread.lastNote.toLowerCase().includes(query) ||
        thread.transactions.some((tx) =>
          tx.userNote?.toLowerCase().includes(query),
        ),
    );
  }, [contactThreads, searchQuery]);

  const handleThreadClick = (thread: any) => {
    router.push({
      pathname: "/contact-detail",
      params: {
        address: thread.address,
        displayName: thread.displayName,
        totalReceived: thread.totalReceived.toString(),
        totalSent: thread.totalSent.toString(),
        transactions: JSON.stringify(thread.transactions),
      },
    });
  };

  const handleTransactionClick = (tx: any) => {
    router.push({
      pathname: "/transaction-detail",
      params: {
        id: tx.id,
        name: tx.counterparty.name,
        address: tx.counterparty.address,
        amount: tx.formattedAmount,
        date: tx.displayDate,
        type: tx.type,
        note: tx.userNote || "",
        category: tx.category || "",
        isInApp: tx.isInApp.toString(),
      },
    });
  };

  const handleTabChange = (tab: ActivityTab) => {
    setActivityTab(tab);
    setSearchQuery("");
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mt-5 mb-4">
          <Text className="text-2xl font-semibold text-primary">Activity</Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search @handle or note..."
        />

        <TabSwitcher activeTab={activityTab} onTabChange={handleTabChange} />

        {activityTab === "transactions" && (
          <TransactionsTab
            transactions={filteredTransactions}
            onTransactionClick={handleTransactionClick}
            isLoading={isLoading}
          />
        )}

        {activityTab === "contacts" && (
          <ContactsTab
            contactThreads={filteredContactThreads}
            onThreadClick={handleThreadClick}
            isLoading={isLoading}
          />
        )}

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
