import { View, Text } from "react-native";
import { ContactThreadItem } from "./ContactThreadItem";
import {
  DisplayTransaction,
  ContactThread,
} from "@/stores/useTransactionHistoryStore";
import { ActivitySkeleton } from "../homeScreen/ActivitySkeleton";

export type { ContactThread };

interface ContactsTabProps {
  contactThreads: ContactThread[];
  onThreadClick: (thread: ContactThread) => void;
  isLoading?: boolean;
}

export function ContactsTab({
  contactThreads,
  onThreadClick,
  isLoading = false,
}: ContactsTabProps) {
  if (isLoading) {
    return <ActivitySkeleton />;
  }

  if (contactThreads.length === 0) {
    return (
      <View className="py-16 items-center">
        <Text className="text-white/40 text-center">No contacts yet</Text>
        <Text className="text-white/30 text-sm text-center mt-2">
          Your transaction contacts will appear here
        </Text>
      </View>
    );
  }

  return (
    <View>
      {contactThreads.map((thread, index) => (
        <ContactThreadItem
          key={thread.address}
          thread={thread}
          index={index}
          onPress={onThreadClick}
        />
      ))}
    </View>
  );
}
