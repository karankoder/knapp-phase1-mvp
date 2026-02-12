import { View } from "react-native";
import { MotiView } from "moti";

interface BalanceLoaderProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BalanceLoader = ({
  width = 80,
  height = 16,
  className = "",
}: BalanceLoaderProps) => {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.6 }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
      }}
      className={className}
      style={{
        width,
        height,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
      }}
    />
  );
};
