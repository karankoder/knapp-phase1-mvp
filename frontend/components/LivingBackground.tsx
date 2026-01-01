import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export const LivingBackground = () => {
  const scale1 = useSharedValue(1);
  const opacity1 = useSharedValue(0.08);
  const translateX1 = useSharedValue(0);
  const translateY1 = useSharedValue(0);

  const scale2 = useSharedValue(1);
  const opacity2 = useSharedValue(0.06);

  useEffect(() => {
    scale1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.2, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity1.value = withRepeat(
      withSequence(
        withTiming(0.08, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.04, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    translateX1.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-40, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    translateY1.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    scale2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.15, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity2.value = withRepeat(
      withSequence(
        withTiming(0.06, {
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.1, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX1.value },
      { translateY: translateY1.value },
      { scale: scale1.value },
    ],
    opacity: opacity1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  return (
    <View className="absolute inset-0 overflow-hidden pointer-events-none">
      <LinearGradient
        colors={["#08050D", "#030204"]}
        className="absolute inset-0"
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View
        style={[animatedStyle1]}
        className="absolute top-[20%] left-[50%] w-[200vw] h-[200vh]"
      >
        <LinearGradient
          colors={[
            "rgba(124, 58, 237, 0.15)",
            "rgba(88, 28, 135, 0.08)",
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

      <Animated.View
        style={[animatedStyle2]}
        className="absolute bottom-[10%] right-[20%] w-[150vw] h-[150vh]"
      >
        <LinearGradient
          colors={["rgba(109, 40, 217, 0.12)", "transparent"]}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 9999,
          }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};
