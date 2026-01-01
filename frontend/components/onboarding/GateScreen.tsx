import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight } from "lucide-react-native";

interface GateScreenProps {
  onInitialize: () => void;
  onRestore: () => void;
}

export const GateScreen = ({ onInitialize, onRestore }: GateScreenProps) => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center px-8">
      <View className="mb-24">
        <Text className="text-6xl font-rajdhani text-champagne tracking-[0.3em]">
          ASTRÂ
        </Text>
      </View>

      <View className="w-full max-w-xs gap-4">
        <Pressable
          onPress={onInitialize}
          className="w-full py-4 rounded-xl border border-champagne/40 bg-champagne/10 flex-row items-center justify-center gap-3 active:scale-95"
        >
          <Text className="font-rajdhani text-base tracking-[0.2em] uppercase text-champagne">
            Initialize
          </Text>
          <ChevronRight size={16} color="#F5D580" />
        </Pressable>

        <Pressable
          onPress={onRestore}
          className="w-full py-4 rounded-xl border border-foreground/10 active:scale-95"
        >
          <Text className="font-rajdhani text-base tracking-[0.15em] uppercase text-foreground/50 text-center">
            Restore Access
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
