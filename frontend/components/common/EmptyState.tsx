import { View, Text } from "react-native";
import { MotiView } from "moti";

interface EmptyStateProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: 100 }}
      className="flex-1 items-center justify-center px-8 py-12"
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "timing", duration: 300, delay: 200 }}
        className="items-center mb-6"
      >
        {typeof icon === "string" ? (
          <View className="w-16 h-16 rounded-full items-center justify-center bg-white/5 mb-4">
            <Text className="text-3xl">{icon}</Text>
          </View>
        ) : (
          <View className="mb-4">{icon}</View>
        )}
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 300, delay: 300 }}
        className="items-center"
      >
        <Text className="text-xl font-semibold text-white mb-2 text-center">
          {title}
        </Text>
        <Text className="text-base text-white/60 text-center leading-5 mb-6">
          {description}
        </Text>
      </MotiView>

      {action && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300, delay: 400 }}
        >
          {action}
        </MotiView>
      )}
    </MotiView>
  );
};
