import { api } from "./api";

export interface UserResult {
  id: string;
  name: string;
  handle: string;
  publicAddress: string;
  profilePicUrl?: string;
}

export interface QuickContact {
  id: string;
  handle: string;
  displayName?: string;
  profilePicUrl?: string;
  publicAddress: string;
}

export const UserService = {
  checkHandle: async (handle: string): Promise<boolean> => {
    try {
      const response = await api.get<{ available: boolean }>(
        `/user/check-handle?handle=${handle}`
      );
      return response.data.available;
    } catch (error) {
      console.error("Check handle error", error);
      return false;
    }
  },
  searchUsers: async (query: string): Promise<UserResult[]> => {
    if (!query || query.length < 2) return [];

    try {
      const { data } = await api.get<{ users: UserResult[] }>(
        `/user/search?q=${query}`
      );
      return data.users;
    } catch (error) {
      console.error("Search failed", error);
      return [];
    }
  },
  getQuickContacts: async (): Promise<QuickContact[]> => {
    try {
      const { data } = await api.get<{ contacts: QuickContact[] }>(
        "/user/quick-contacts"
      );
      return data.contacts;
    } catch (error) {
      console.error("Failed to fetch quick contacts", error);
      return [];
    }
  },
};
