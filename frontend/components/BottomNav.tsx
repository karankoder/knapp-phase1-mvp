import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Clock, Home, TrendingUp, User } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export type TabType = "home" | "market" | "history" | "profile";

const tabs = [
  { id: "home" as const, route: "index", icon: Home, label: "Home" },
  { id: "market" as const, route: "market", icon: TrendingUp, label: "Market" },
  { id: "history" as const, route: "history", icon: Clock, label: "History" },
  { id: "profile" as const, route: "profile", icon: User, label: "Profile" },
];

/**
 * Custom bottom navigation component that works with Expo Router's tab navigation
 * Receives BottomTabBarProps from Expo Router's Tabs component
 */
export const BottomNav = ({ state, navigation }: BottomTabBarProps) => {
  const currentRoute = state.routes[state.index]?.name;

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50">
      <View className="max-w-md mx-auto">
        <View className="mx-4 mb-4 rounded-2xl overflow-hidden border border-primary/10">
          <BlurView
            intensity={80}
            tint="dark"
            className="flex-row items-center justify-around py-3"
          >
            {tabs.map((tab) => {
              const isActive = currentRoute === tab.route;
              const Icon = tab.icon;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    const event = navigation.emit({
                      type: "tabPress",
                      target: tab.route,
                      canPreventDefault: true,
                    });

                    if (!isActive && !event.defaultPrevented) {
                      // Navigate to the tab route
                      navigation.navigate(tab.route as never);
                    }
                  }}
                  className={`flex-col items-center gap-1 px-4 py-2 rounded-xl active:scale-95 transition-all ${
                    isActive ? "" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    color={
                      isActive ? "hsl(42, 45%, 77%)" : "rgb(161, 161, 170)"
                    }
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <Text
                    className={`text-[10px] font-medium tracking-wide ${
                      isActive ? "text-primary" : "text-zinc-400"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </BlurView>
        </View>
      </View>
    </View>
  );
};
