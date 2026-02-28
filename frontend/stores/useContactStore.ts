import { create } from "zustand";
import { ContactService } from "@/services/contact.service";

export interface Contact {
  id: string;
  handle: string;
  name?: string;
  email?: string;
  publicAddress: string;
  smartAccountAddress: string;
  profilePicUrl?: string;
  lastTransactionAt?: string;
}

interface ContactState {
  // Contact lists
  recentContacts: Contact[];
  searchResults: Contact[];
  favoriteContacts: Contact[];

  // Search state
  searchQuery: string;
  isSearching: boolean;
  searchError: string | null;

  // Loading states
  isLoadingRecents: boolean;
  isLoadingSearch: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  searchContacts: (query: string) => Promise<void>;
  getRecentContacts: () => Promise<void>;
  clearSearch: () => void;
  addToFavorites: (contact: Contact) => void;
  removeFromFavorites: (contactId: string) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  // Initial state
  recentContacts: [],
  searchResults: [],
  favoriteContacts: [],
  searchQuery: "",
  isSearching: false,
  searchError: null,
  isLoadingRecents: false,
  isLoadingSearch: false,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, searchError: null });
  },

  searchContacts: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isLoadingSearch: true, searchError: null });

    try {
      const results = await ContactService.searchContacts(query);
      set({ searchResults: results, isSearching: false });
    } catch (error: any) {
      console.error("Search contacts failed:", error);
      set({
        searchError: error.message || "Failed to search contacts",
        searchResults: [],
        isSearching: false,
      });
    } finally {
      set({ isLoadingSearch: false });
    }
  },

  getRecentContacts: async () => {
    set({ isLoadingRecents: true });

    try {
      const contacts = await ContactService.getRecentContacts();
      set({ recentContacts: contacts });
    } catch (error: any) {
      console.error("Failed to load recent contacts:", error);
      set({ recentContacts: [] });
    } finally {
      set({ isLoadingRecents: false });
    }
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: "",
      searchError: null,
      isSearching: false,
      isLoadingSearch: false,
    });
  },

  addToFavorites: (contact: Contact) => {
    const current = get().favoriteContacts;
    if (!current.find((c) => c.id === contact.id)) {
      set({ favoriteContacts: [...current, contact] });
    }
  },

  removeFromFavorites: (contactId: string) => {
    set({
      favoriteContacts: get().favoriteContacts.filter(
        (c) => c.id !== contactId,
      ),
    });
  },
}));
