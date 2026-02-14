import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { useWalletStore } from "./useWalletStore";

interface UserProfile {
  id: string;
  handle: string;
  publicAddress: string;
  smartAccountAddress?: string;
  email?: string;
  profilePicUrl?: string;
  authProvider?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: UserProfile, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync("auth_token", token);
    await SecureStore.setItemAsync("user_profile", JSON.stringify(user));

    set({ user, token, isAuthenticated: true });

    // Initialize wallet address after login
    if (user.publicAddress) {
      useWalletStore
        .getState()
        .setWalletAddress(user.publicAddress, user.smartAccountAddress);
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("user_profile");

    set({ user: null, token: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const userStr = await SecureStore.getItemAsync("user_profile");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
        });

        // Initialize wallet address on session restore
        if (user.publicAddress) {
          useWalletStore
            .getState()
            .setWalletAddress(user.publicAddress, user.smartAccountAddress);
        }
      }
    } catch (e) {
      console.error("Failed to load session", e);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
      SecureStore.setItemAsync("user_profile", JSON.stringify(updatedUser));
    }
  },
}));
