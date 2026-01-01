import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, StorageKey } from "../constants/storage";

/**
 * Storage utility service for centralized storage operations
 * Provides type-safe methods for reading/writing to AsyncStorage
 */
export class StorageService {
  /**
   * Get a value from storage
   */
  static async getItem(key: StorageKey): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set a value in storage
   */
  static async setItem(key: StorageKey, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove a value from storage
   */
  static async removeItem(key: StorageKey): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove multiple items from storage
   */
  static async multiRemove(keys: StorageKey[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error("Error removing multiple storage keys:", error);
      return false;
    }
  }

  /**
   * Check if onboarding is complete
   */
  static async isOnboardingComplete(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === "true";
  }

  /**
   * Mark onboarding as complete
   */
  static async setOnboardingComplete(): Promise<boolean> {
    return await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
  }

  /**
   * Get user handle
   */
  static async getHandle(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.HANDLE);
  }

  /**
   * Set user handle
   */
  static async setHandle(handle: string): Promise<boolean> {
    return await this.setItem(STORAGE_KEYS.HANDLE, handle);
  }

  /**
   * Get seed phrase
   */
  static async getSeedPhrase(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.SEED_PHRASE);
  }

  /**
   * Set seed phrase
   */
  static async setSeedPhrase(seedPhrase: string): Promise<boolean> {
    return await this.setItem(STORAGE_KEYS.SEED_PHRASE, seedPhrase);
  }

  /**
   * Check if user exists (has handle and seed phrase)
   */
  static async hasExistingUser(): Promise<boolean> {
    const handle = await this.getHandle();
    const seedPhrase = await this.getSeedPhrase();
    return !!(handle && seedPhrase);
  }

  /**
   * Clear all user data (for logout/new account)
   */
  static async clearUserData(): Promise<boolean> {
    return await this.multiRemove([
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      STORAGE_KEYS.HANDLE,
      STORAGE_KEYS.SEED_PHRASE,
    ]);
  }
}

