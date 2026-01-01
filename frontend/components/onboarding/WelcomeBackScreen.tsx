import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fingerprint } from "lucide-react-native";

interface WelcomeBackScreenProps {
  handle: string;
  onUnlock: () => void;
  onNewAccount: () => void;
}

export const WelcomeBackScreen = ({
  handle,
  onUnlock,
  onNewAccount,
}: WelcomeBackScreenProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleUnlock = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onUnlock();
    }, 800);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center px-8">
      <View className="mb-12 items-center">
        <Text className="text-sm text-foreground/40 font-rajdhani tracking-wider mb-2">
          Welcome back,
        </Text>
        <Text className="text-2xl font-orbitron tracking-[0.15em] text-champagne">
          @{handle}
        </Text>
      </View>

      <Pressable
        onPress={handleUnlock}
        disabled={isAuthenticating}
        className="w-full max-w-xs py-5 rounded-xl border border-champagne/40 bg-champagne/10 flex-row items-center justify-center gap-4 active:scale-95"
      >
        <Fingerprint size={24} color="hsl(42, 45%, 77%)" />
        <Text className="font-rajdhani text-sm tracking-[0.2em] uppercase text-champagne">
          {isAuthenticating ? "Authenticating..." : "Unlock Vault"}
        </Text>
      </Pressable>

      <Pressable onPress={onNewAccount} className="mt-6">
        <Text className="text-xs text-foreground/30 font-rajdhani tracking-wider">
          Use a different account
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

