import { ArrowRight, Search, X, Wallet } from "lucide-react-native";
import { Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { MotiView } from "moti";
import { useEffect, useCallback } from "react";
import { Contact, useContactStore } from "@/stores/useContactStore";
import { ContactEmptyStates } from "./ContactEmptyStates";
import { ContactsLoading } from "./ContactsLoading";
import { useAuthStore } from "@/stores/useAuthStore";
import debounce from "@/utils/debounce";
import { COLORS } from "@/utils/constants";

interface ContactsListProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSelectContact: (contact: Contact) => void;
}

export const ContactsList = ({
  searchQuery,
  onSearchChange,
  onSelectContact,
}: ContactsListProps) => {
  const { user } = useAuthStore();
  const {
    recentContacts,
    searchResults,
    isLoadingRecents,
    isLoadingSearch,
    searchError,
    searchContacts,
    getRecentContacts,
  } = useContactStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        await searchContacts(query);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    getRecentContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const displayContacts = searchQuery ? searchResults : recentContacts;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingRecents;
  const hasQuery = searchQuery.trim().length > 0;
  const showResults = displayContacts.length > 0;

  const handleRetry = () => {
    if (hasQuery) {
      searchContacts(searchQuery);
    } else {
      getRecentContacts();
    }
  };

  const handleInvite = () => {
    // TODO: Implement invite functionality
    console.log("Invite user:", searchQuery);
  };
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: 200 }}
    >
      <View className="flex-row items-center mb-6">
        <View className="flex-1 flex-row items-center px-3 py-2 rounded-2xl border border-white/15 bg-white/5">
          <View className="mr-2">
            <Search size={18} color="rgba(255, 255, 255, 0.4)" />
          </View>

          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search name or @handle..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            className="flex-1 text-base text-white"
            autoCapitalize="none"
          />

          {searchQuery ? (
            <Pressable
              onPress={() => onSearchChange("")}
              className="ml-2 w-6 h-6 rounded-full items-center justify-center bg-white/10 active:opacity-70"
            >
              <X size={12} color="rgba(255, 255, 255, 0.6)" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <Pressable className="w-full flex-row items-center gap-3 p-4 rounded-2xl border border-white/15 mb-4 active:opacity-70 bg-white/5">
        <View className="w-12 h-12 rounded-full items-center justify-center bg-primary/20">
          <Wallet size={20} color={COLORS.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-white">
            Paste Wallet Address
          </Text>
          <Text className="text-sm text-muted">
            Send to any external address
          </Text>
        </View>
      </Pressable>

      {isLoading ? (
        <View>
          <Text className="text-sm font-medium uppercase mb-3 text-muted tracking-widest">
            {hasQuery ? "Searching..." : "Loading Contacts..."}
          </Text>
          <ContactsLoading count={3} />
        </View>
      ) : showResults ? (
        <View>
          <Text className="text-sm font-medium uppercase mb-3 text-muted tracking-widest">
            {hasQuery ? "Search Results" : "Recent Contacts"}
          </Text>
          <ScrollView
            style={{ maxHeight: 320 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View style={{ gap: 8 }}>
              {displayContacts.map((contact) => (
                <Pressable
                  key={contact.id}
                  onPress={() => onSelectContact(contact)}
                  className="flex-row items-center gap-3 p-4 rounded-2xl border border-white/15 bg-white/5 active:opacity-70"
                >
                  <View className="w-10 h-10 rounded-full items-center justify-center bg-white/10">
                    {contact.profilePicUrl ? (
                      <Text className="text-xs font-bold text-white">
                        {contact.handle.slice(0, 2).toUpperCase()}
                      </Text>
                    ) : (
                      <Text className="text-xs font-bold text-white">
                        {contact.handle.slice(0, 2).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-platinum">
                      {contact.name || contact.handle}
                    </Text>
                    <Text className="text-sm text-muted/80">
                      @{contact.handle}
                    </Text>
                  </View>
                  <ArrowRight size={18} color="rgba(245, 245, 240, 0.5)" />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : searchError ? (
        <ContactEmptyStates type="network-error" onRetry={handleRetry} />
      ) : hasQuery ? (
        <ContactEmptyStates
          type="no-search-results"
          searchQuery={searchQuery}
          onInvite={handleInvite}
        />
      ) : (
        <ContactEmptyStates type="no-contacts" userHandle={user?.handle} />
      )}
    </MotiView>
  );
};
