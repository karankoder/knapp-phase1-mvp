import { View, Text, ScrollView, Pressable } from "react-native";
import { ArrowDownLeft, ArrowUpRight, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { AnimatedCounter } from "./AnimatedCounter";
import { EmptyVaultCard } from "./EmptyVaultCard";

interface HomeScreenProps {
  onSend?: () => void;
  onReceive?: () => void;
}

const transactions = [
  {
    id: 1,
    name: "Bitcoin Purchase",
    date: "Today, 2:34 PM",
    amount: "+0.024 BTC",
    type: "receive",
  },
  {
    id: 2,
    name: "Sent to @Marcus",
    date: "Yesterday",
    amount: "-$150.00",
    type: "send",
  },
  {
    id: 3,
    name: "Ethereum Swap",
    date: "Dec 14",
    amount: "+1.2 ETH",
    type: "receive",
  },
  {
    id: 4,
    name: "USDC Transfer",
    date: "Dec 13",
    amount: "-$500.00",
    type: "send",
  },
  {
    id: 5,
    name: "Solana Reward",
    date: "Dec 12",
    amount: "+2.5 SOL",
    type: "receive",
  },
];

const isVaultEmpty = false;

export const HomeScreen = ({ onSend, onReceive }: HomeScreenProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const translateY = useSharedValue(0);

  const setRevealed = (revealed: boolean) => {
    setIsRevealed(revealed);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY >= 0 && event.translationY <= 100) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 60 || event.velocityY > 300) {
        translateY.value = withSpring(80);
        runOnJS(setRevealed)(true);
      } else if (event.translationY < -30 || event.velocityY < -200) {
        translateY.value = withSpring(0);
        runOnJS(setRevealed)(false);
      } else {
        translateY.value = withSpring(isRevealed ? 80 : 0);
      }
    });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const balanceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: translateY.value / 80,
    transform: [{ translateY: -30 + (translateY.value / 80) * 30 }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (translateY.value / 80) * 60 }],
  }));

  const toggleReveal = () => {
    const newState = !isRevealed;
    setIsRevealed(newState);
    translateY.value = withSpring(newState ? 80 : 0);
  };

  return (
    <View className="flex-1 pb-24">
      <GestureDetector gesture={panGesture}>
        <Animated.View style={headerAnimatedStyle}>
          <Pressable
            onPress={toggleReveal}
            className="pt-8 pb-4 flex-col items-center gap-2"
          >
            <View className="w-10 h-1 rounded-full bg-champagne/30" />
            <Animated.View
              style={{
                transform: [{ rotate: isRevealed ? "180deg" : "0deg" }],
              }}
            >
              <ChevronDown size={20} color="hsl(42, 45%, 77%)" opacity={0.5} />
            </Animated.View>
          </Pressable>

          <Animated.View
            style={balanceAnimatedStyle}
            className="px-6 pt-6 pb-8 items-center"
          >
            <Text className="font-hud text-[10px] font-medium tracking-hud-ultra text-champagne/80 uppercase mb-4">
              Total Liquidity
            </Text>

            {isRevealed ? (
              <View>
                <AnimatedCounter
                  value={24500}
                  prefix="$"
                  decimals={2}
                  duration={1500}
                  className="text-[56px] font-bold tracking-tight text-champagne"
                />
              </View>
            ) : (
              <Text className="text-[56px] font-hud font-bold tracking-tight text-primary">
                $24,500<Text className="text-[32px] opacity-60">.00</Text>
              </Text>
            )}

            <Text className="font-data text-sm text-emerald-400/90 font-semibold tracking-hud mt-3">
              +$1,240.50 (5.3%)
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={contentAnimatedStyle} className="px-6 mt-4">
          <View className="flex-row gap-4 mb-10">
            <Pressable onPress={onReceive} className="flex-1 active:scale-95">
              <View className="overflow-hidden rounded-xl border border-champagne/20">
                <BlurView
                  intensity={60}
                  tint="dark"
                  className="py-4 items-center justify-center gap-3 flex-row"
                >
                  <ArrowDownLeft size={20} color="hsl(42, 45%, 77%)" />
                  <Text className="font-hud text-xs font-semibold tracking-hud text-foreground">
                    RECEIVE
                  </Text>
                </BlurView>
              </View>
            </Pressable>

            <Pressable onPress={onSend} className="flex-1 active:scale-95">
              <View className="overflow-hidden rounded-xl border border-champagne/20">
                <BlurView
                  intensity={60}
                  tint="dark"
                  className="py-4 items-center justify-center gap-3 flex-row"
                >
                  <ArrowUpRight size={20} color="hsl(42, 45%, 77%)" />
                  <Text className="font-hud text-xs font-semibold tracking-hud text-foreground">
                    SEND
                  </Text>
                </BlurView>
              </View>
            </Pressable>
          </View>

          {isVaultEmpty ? (
            <View className="mb-6">
              <EmptyVaultCard onDeposit={onReceive || (() => {})} />
            </View>
          ) : null}

          <View className="flex-1">
            <Text className="font-hud text-[10px] font-medium text-champagne/60 uppercase tracking-hud-wide mb-4">
              Recent Activity
            </Text>
            <View>
              {transactions.map((tx, index) => (
                <Pressable
                  key={tx.id}
                  className="flex-row items-center justify-between py-3 px-1 border-b border-champagne/10 active:scale-[0.98]"
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === "receive"
                          ? "bg-champagne/10 border border-champagne/20"
                          : "bg-muted/50 border border-muted"
                      }`}
                    >
                      {tx.type === "receive" ? (
                        <ArrowDownLeft size={16} color="hsl(42, 45%, 77%)" />
                      ) : (
                        <ArrowUpRight size={16} color="hsl(0, 0%, 50%)" />
                      )}
                    </View>
                    <View>
                      <Text className="font-data text-sm font-semibold text-foreground tracking-wide">
                        {tx.name}
                      </Text>
                      <Text className="font-data text-xs text-muted-foreground">
                        {tx.date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`font-data text-sm font-semibold tracking-wide ${
                      tx.type === "receive"
                        ? "text-champagne"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tx.amount}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
