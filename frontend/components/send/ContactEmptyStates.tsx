import { Pressable, Text, View } from "react-native";
import { Users, UserPlus, Search, Wifi, Copy } from "lucide-react-native";
import { MotiView } from "moti";
import { EmptyState } from "../common/EmptyState";
import { COLORS } from "@/utils/constants";

interface ContactEmptyStatesProps {
  type: "no-contacts" | "no-search-results" | "network-error" | "invite-user";
  searchQuery?: string;
  onRetry?: () => void;
  onInvite?: () => void;
  userHandle?: string;
}

export const ContactEmptyStates = ({
  type,
  searchQuery,
  onRetry,
  onInvite,
  userHandle,
}: ContactEmptyStatesProps) => {
  const emptyStates = {
    "no-contacts": {
      icon: <Users size={32} color={COLORS.white} opacity={0.6} />,
      title: "No Recent Contacts",
      description:
        "Start sending to friends and they'll appear here for quick access.",
      action: userHandle ? (
        <View className="items-center">
          <Text className="text-sm text-white/40 mb-3">
            Share your handle to get started
          </Text>
          <Pressable className="flex-row items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl active:opacity-70">
            <Text className="text-base font-mono text-primary">
              @{userHandle}
            </Text>
            <Copy size={16} color={COLORS.primary} />
          </Pressable>
        </View>
      ) : undefined,
    },

    "no-search-results": {
      icon: <Search size={32} color={COLORS.white} opacity={0.6} />,
      title: "No Results Found",
      description: searchQuery
        ? `No users found for "${searchQuery}". Try searching with @username format.`
        : "Try searching for a username or handle.",
      action:
        searchQuery && !searchQuery.startsWith("@") ? (
          <Pressable
            onPress={onInvite}
            className="flex-row items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl active:opacity-80"
          >
            <UserPlus size={18} color={COLORS.primary} />
            <Text className="text-base font-medium text-primary">
              Invite them to ATARA
            </Text>
          </Pressable>
        ) : undefined,
    },

    "network-error": {
      icon: <Wifi size={32} color={COLORS.white} opacity={0.6} />,
      title: "Connection Issue",
      description:
        "Unable to search contacts right now. Check your connection and try again.",
      action: (
        <Pressable
          onPress={onRetry}
          className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl active:opacity-70"
        >
          <Text className="text-base font-medium text-white">Try Again</Text>
        </Pressable>
      ),
    },

    "invite-user": {
      icon: <UserPlus size={32} color={COLORS.primary} />,
      title: "User Not Found",
      description: searchQuery
        ? `@${searchQuery} isn't on ATARA yet. Invite them to join!`
        : "This user hasn't joined ATARA yet.",
      action: (
        <Pressable
          onPress={onInvite}
          className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl active:opacity-80"
        >
          <Text className="text-base font-medium text-primary">
            Send Invite
          </Text>
        </Pressable>
      ),
    },
  };

  const config = emptyStates[type];

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={config.action}
    />
  );
};
