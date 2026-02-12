import { View } from "react-native";
import { MotiView } from "moti";

interface ContactsLoadingProps {
  count?: number;
}

export const ContactsLoading = ({ count = 5 }: ContactsLoadingProps) => {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: count }).map((_, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing",
            duration: 1000,
            delay: index * 100,
            loop: true,
            repeatReverse: true,
          }}
          className="flex-row items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/15"
        >
          <View className="w-10 h-10 rounded-full bg-white/10" />

          <View className="flex-1 gap-2">
            <View
              className="h-4 bg-white/10 rounded-md"
              style={{ width: "60%" }}
            />
            <View
              className="h-3 bg-white/10 rounded-md"
              style={{ width: "40%" }}
            />
          </View>

          <View className="w-4 h-4 bg-white/10 rounded-sm" />
        </MotiView>
      ))}
    </View>
  );
};
