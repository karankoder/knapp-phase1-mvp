import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AddressBookState {
  contacts: Record<string, string>;
  setNickname: (address: string, nickname: string) => void;
  removeNickname: (address: string) => void;
  hasNickname: (address: string) => boolean;
  getDisplayName: (address: string) => string;
}

const refreshTransactionHistory = () => {
  // Lazy require to avoid circular dependency at module load time
  const {
    useTransactionHistoryStore,
  } = require("@/stores/useTransactionHistoryStore");
  useTransactionHistoryStore.getState().rebuildDisplayHistory();
};

export const useAddressBookStore = create<AddressBookState>()(
  persist(
    (set, get) => ({
      contacts: {},

      setNickname: (address, nickname) => {
        const normalizedAddr = address.toLowerCase();
        set((state) => ({
          contacts: { ...state.contacts, [normalizedAddr]: nickname },
        }));
        refreshTransactionHistory();
      },

      removeNickname: (address) => {
        const normalizedAddr = address.toLowerCase();
        set((state) => {
          const newContacts = { ...state.contacts };
          delete newContacts[normalizedAddr];
          return { contacts: newContacts };
        });
        refreshTransactionHistory();
      },

      hasNickname: (address) => {
        if (!address) return false;
        return !!get().contacts[address.toLowerCase()];
      },

      getDisplayName: (address) => {
        if (!address) return address;
        return get().contacts[address.toLowerCase()] || address;
      },
    }),
    {
      name: "knapp-address-book",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
