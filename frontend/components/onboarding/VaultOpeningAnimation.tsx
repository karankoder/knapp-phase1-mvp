import { View } from "react-native";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export const VaultOpeningAnimation = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(50, { duration: 800 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 800 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-background">
      <Animated.View
        style={animatedStyle}
        className="w-4 h-4 rounded-full bg-champagne"
      />
    </View>
  );
};

