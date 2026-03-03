import { View, Text, Pressable } from "react-native";
import { MotiView } from "moti";
import { Pencil, BadgeCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/utils/constants";

interface IdentityCardProps {
  displayName?: string;
  handle?: string;
  isVerified?: boolean;
}

export const IdentityCard = ({
  displayName = "Thomas Vance",
  handle = "@ThomasV",
  isVerified = true,
}: IdentityCardProps) => {
  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: 200 }}
      className="rounded-2xl p-4 border border-white/10 mb-6"
      style={{ backgroundColor: `${COLORS.white}05` }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text
            className="text-xs font-mono uppercase mb-1"
            style={{ color: `${COLORS.white}40`, letterSpacing: 1 }}
          >
            Display Name
          </Text>
          <Text className="text-white text-base font-semibold">
            {displayName}
          </Text>
        </View>
        <Pressable
          onPress={handleEdit}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: `${COLORS.white}08` }}
        >
          <Pencil size={14} color={`${COLORS.white}50`} />
        </Pressable>
      </View>

      <View
        className="h-px mb-3"
        style={{ backgroundColor: `${COLORS.white}08` }}
      />

      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text
            className="text-xs font-mono uppercase mb-1"
            style={{ color: `${COLORS.white}40`, letterSpacing: 1 }}
          >
            Handle
          </Text>
          <Text
            className="text-base font-semibold"
            style={{ color: COLORS.accent }}
          >
            {handle}
          </Text>
        </View>
        <Pressable
          onPress={handleEdit}
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: `${COLORS.white}08` }}
        >
          <Pencil size={14} color={`${COLORS.white}50`} />
        </Pressable>
      </View>

      {isVerified && (
        <>
          <View
            className="h-px mb-3"
            style={{ backgroundColor: `${COLORS.white}08` }}
          />
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={16} color={COLORS.emarald} />
            <Text
              className="text-sm font-medium"
              style={{ color: COLORS.emarald }}
            >
              Verified
            </Text>
          </View>
        </>
      )}
    </MotiView>
  );
};
