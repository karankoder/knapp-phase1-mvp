import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Share2, X, CheckCircle2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View, Dimensions, Share } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface ProofCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  amount: string;
  coin: string;
  recipientHandle: string;
  transactionId: string;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 48, 300);

const formatTxHash = (hash: string) => {
  if (!hash) return "0x00...0000";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export const ProofCardModal = ({
  isOpen,
  onClose,
  onShare,
  amount,
  coin,
  recipientHandle,
  transactionId,
}: ProofCardModalProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [cardReady, setCardReady] = useState(false);

  const titleOpacity = useSharedValue(0.5);
  const loadingProgress = useSharedValue(-100);
  const cardScale = useSharedValue(0.7);
  const cardOpacity = useSharedValue(0.5);
  const buttonOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      setCardReady(false);

      titleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 750 }),
          withTiming(0.5, { duration: 750 })
        ),
        -1,
        false
      );

      loadingProgress.value = withRepeat(
        withTiming(200, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );

      const timer = setTimeout(() => {
        setIsGenerating(false);
        titleOpacity.value = withTiming(1, { duration: 300 });
        cardScale.value = withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.cubic),
        });
        cardOpacity.value = withTiming(1, { duration: 500 });

        setTimeout(() => {
          setCardReady(true);
          buttonOpacity.value = withTiming(1, { duration: 500 });
        }, 300);
      }, 1500);

      return () => {
        clearTimeout(timer);
        titleOpacity.value = 0.5;
        loadingProgress.value = -100;
        cardScale.value = 0.7;
        cardOpacity.value = 0.5;
        buttonOpacity.value = 0.3;
      };
    }
  }, [isOpen]);

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `Payment of ${amount} ${coin} to ${recipientHandle} confirmed on Astrâ.\nRef: ${transactionId}`,
      });
      if (onShare) onShare();
    } catch (error) {
      console.error(error);
    }
  };

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: loadingProgress.value }],
  }));

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(8, 5, 15, 0.98)" }}
      >
        <BlurView intensity={20} className="flex-1" tint="dark">
          <View className="flex-1 px-6">
            <Animated.View
              entering={FadeIn.delay(300)}
              style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
            >
              <Pressable
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center active:scale-90"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <X size={20} color="#8B8B8B" />
              </Pressable>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(500)}
              style={{
                position: "absolute",
                top: 80,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <Animated.View style={titleStyle}>
                <Text
                  className="font-rajdhani-medium text-base uppercase text-champagne"
                  style={{ letterSpacing: 6 }}
                >
                  {isGenerating ? "Generating Proof..." : "Proof Generated"}
                </Text>
              </Animated.View>

              {isGenerating && (
                <Animated.View
                  entering={FadeIn}
                  style={{
                    marginTop: 16,
                    width: 128,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(229, 210, 166, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  <Animated.View
                    style={[loadingStyle, { width: "30%", height: "100%" }]}
                  >
                    <LinearGradient
                      colors={["#C4A86B", "#E5D2A6"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: "100%", height: "100%", borderRadius: 2 }}
                    />
                  </Animated.View>
                </Animated.View>
              )}
            </Animated.View>

            <View className="flex-1 justify-center items-center">
              <Animated.View
                style={[cardContainerStyle, { width: CARD_WIDTH }]}
              >
                <View
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: "rgba(15, 10, 25, 0.95)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 30 },
                    shadowOpacity: 0.9,
                    shadowRadius: 60,
                    elevation: 30,
                  }}
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "#C4A86B",
                      "#E5D2A6",
                      "#C4A86B",
                      "transparent",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      zIndex: 10,
                    }}
                  />
                  <LinearGradient
                    colors={["#C4A86B", "#B39859", "#C4A86B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: 2,
                      zIndex: 10,
                    }}
                  />
                  <LinearGradient
                    colors={["#C4A86B", "#B39859", "#C4A86B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 2,
                      zIndex: 10,
                    }}
                  />
                  <LinearGradient
                    colors={[
                      "transparent",
                      "#C4A86B",
                      "#E5D2A6",
                      "#C4A86B",
                      "transparent",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      zIndex: 10,
                    }}
                  />

                  <View style={{ padding: 32 }}>
                    <View style={{ alignItems: "center", marginBottom: 32 }}>
                      <Text className="font-rajdhani-medium text-base uppercase tracking-hud-wide text-champagne">
                        Astrâ
                      </Text>
                    </View>

                    <View style={{ alignItems: "center", marginBottom: 24 }}>
                      <Text
                        className="font-rajdhani-bold text-4xl text-champagne"
                        style={{ letterSpacing: 2 }}
                      >
                        - {amount} {coin}
                      </Text>
                    </View>

                    <View style={{ alignItems: "center", marginBottom: 32 }}>
                      <Text className="font-rajdhani text-base text-foreground/85">
                        Sent to{" "}
                        <Text className="font-rajdhani-semibold text-foreground">
                          {recipientHandle}
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        marginBottom: 20,
                        overflow: "hidden",
                      }}
                    >
                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(196, 168, 107, 0.3)",
                          "transparent",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>

                    <View style={{ alignItems: "center", gap: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          opacity: 0.8,
                        }}
                      >
                        <CheckCircle2 size={12} color="#C4A86B" />
                        <Text
                          className="font-rajdhani-medium text-[10px] text-champagne uppercase"
                          style={{ letterSpacing: 2 }}
                        >
                          Confirmed On-Chain
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderWidth: 1,
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          className="font-rajdhani-medium text-xs text-muted-foreground"
                          style={{ letterSpacing: 1 }}
                        >
                          REF: {formatTxHash(transactionId)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      width: 12,
                      height: 12,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderColor: "rgba(229, 210, 166, 0.3)",
                      borderTopLeftRadius: 2,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 12,
                      height: 12,
                      borderTopWidth: 1,
                      borderRightWidth: 1,
                      borderColor: "rgba(229, 210, 166, 0.3)",
                      borderTopRightRadius: 2,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      width: 12,
                      height: 12,
                      borderBottomWidth: 1,
                      borderLeftWidth: 1,
                      borderColor: "rgba(229, 210, 166, 0.3)",
                      borderBottomLeftRadius: 2,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      width: 12,
                      height: 12,
                      borderBottomWidth: 1,
                      borderRightWidth: 1,
                      borderColor: "rgba(229, 210, 166, 0.3)",
                      borderBottomRightRadius: 2,
                    }}
                  />
                </View>
              </Animated.View>
            </View>

            <Animated.View
              style={[
                buttonStyle,
                { position: "absolute", bottom: 40, left: 24, right: 24 },
              ]}
            >
              <Pressable
                onPress={handleNativeShare}
                disabled={!cardReady}
                className="py-4 rounded-xl items-center justify-center active:scale-95"
                style={{
                  backgroundColor: cardReady
                    ? "#C4A86B"
                    : "rgba(229, 210, 166, 0.1)",
                  shadowColor: cardReady ? "#E5D2A6" : "transparent",
                  shadowOffset: { width: 0, height: 15 },
                  shadowOpacity: 0.35,
                  shadowRadius: 40,
                  elevation: 15,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Share2 size={20} color={cardReady ? "#0D080F" : "#8B8B8B"} />
                  <Text
                    numberOfLines={1}
                    className="font-orbitron-medium text-sm uppercase"
                    style={{
                      color: cardReady ? "#0D080F" : "#8B8B8B",
                      letterSpacing: 2,
                    }}
                  >
                    Share Proof
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};
