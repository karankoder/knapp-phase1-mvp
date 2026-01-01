import { View, Text, Pressable } from "react-native";
import { ArrowDownLeft } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface EmptyVaultCardProps {
  onDeposit: () => void;
}

export const EmptyVaultCard = ({ onDeposit }: EmptyVaultCardProps) => {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="relative overflow-hidden rounded-xl">
      <Animated.View
        style={[animatedAuraStyle]}
        className="absolute -inset-5 rounded-full"
      >
        <LinearGradient
          colors={[
            "rgba(229, 210, 166, 0.15)",
            "rgba(229, 210, 166, 0.08)",
            "transparent",
          ]}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 9999,
          }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <View className="overflow-hidden rounded-xl border border-champagne/20">
        <BlurView intensity={80} tint="dark" className="p-6">
          <View className="items-center">
            <Text className="font-display text-xl font-bold text-champagne mb-2 tracking-wide">
              Wallet empty
            </Text>
            <Text className="font-sans text-sm text-muted-foreground mb-6 text-center">
              Secure your first assets to start tracking your wealth
            </Text>

            <Pressable
              onPress={onDeposit}
              className="active:scale-95 transition-all"
            >
              <LinearGradient
                colors={[
                  "hsl(48, 80%, 55%)",
                  "hsl(48, 80%, 55%)",
                  "hsl(50, 100%, 75%)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-8 py-3 rounded-xl flex-row items-center justify-center gap-2"
              >
                <ArrowDownLeft size={16} color="hsl(260, 20%, 5%)" />
                <Text className="font-hud text-sm font-semibold tracking-hud-wide uppercase text-primary-foreground">
                  Deposit Now
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </BlurView>
      </View>
    </View>
  );
};
