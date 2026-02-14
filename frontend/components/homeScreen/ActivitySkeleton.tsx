import { View } from "react-native";
import { MotiView } from "moti";

export const ActivitySkeleton = () => (
  <View>
    {[1, 2, 3].map((i) => (
      <MotiView
        key={i}
        from={{ opacity: 0.3 }}
        animate={{ opacity: 0.6 }}
        transition={{ type: "timing", duration: 1000, loop: true }}
        className="flex-row items-center justify-between py-4 border-b border-white/5"
      >
        <View className="flex-row items-center gap-3">
          <View
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          />
          <View className="gap-1.5">
            <View
              style={{
                width: 100,
                height: 14,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 6,
              }}
            />
            <View
              style={{
                width: 60,
                height: 10,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 4,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: 70,
            height: 14,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 6,
          }}
        />
      </MotiView>
    ))}
  </View>
);
