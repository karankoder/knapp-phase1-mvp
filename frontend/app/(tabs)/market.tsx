import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LivingBackground } from "../../components/LivingBackground";

export default function MarketTab() {
  return (
    <View className="flex-1 bg-transparent">
      <LivingBackground />

      <SafeAreaView className="flex-1 max-w-md mx-auto w-full" edges={["top"]}>
        <View className="pt-6 pb-2 px-6 flex-row items-center justify-between">
          <Text className="text-xl font-semibold tracking-wide text-foreground">
            Astr<Text className="text-primary">â</Text>
          </Text>

          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
            <Text className="text-xs font-bold text-foreground">TV</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground text-lg">Market Screen</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
