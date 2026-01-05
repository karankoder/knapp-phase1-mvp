import { useState, useCallback, useEffect } from "react";
import { UserService } from "../services/user.service";
import { getAvatarGradient } from "../utils/theme";

export interface ContactUI {
  id: string;
  name: string;
  handle: string;
  publicAddress: string;
  avatar: string;
  gradientColors: [string, string];
}

const formatUserToUI = (user: any): ContactUI => {
  const name = user.displayName || user.handle || "Unknown";
  return {
    id: user.id,
    name: name,
    handle: user.handle,
    publicAddress: user.publicAddress,
    avatar: name.substring(0, 2).toUpperCase(),
    gradientColors: getAvatarGradient(user.handle),
  };
};

export const useQuickContacts = () => {
  const [data, setData] = useState<ContactUI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const contacts = await UserService.getQuickContacts();

        if (isMounted) {
          const formatted = contacts.map(formatUserToUI);
          setData(formatted);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch quick contacts", err);
          setError("Failed to load contacts");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};

export const useUserSearch = () => {
  const [isSearching, setIsSearching] = useState(false);

  const [searchResults, setSearchResults] = useState<ContactUI[]>([]);

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const users = await UserService.searchUsers(query);
      const formatted = users.map(formatUserToUI);
      setSearchResults(formatted);
    } catch (error) {
      console.error("Search failed", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { isSearching, searchResults, search, setSearchResults };
};
