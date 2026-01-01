import { Tabs } from "expo-router";
import { View } from "react-native";
import { BottomNav } from "../../components/BottomNav";

export default function TabsLayout() {
  return (
    <View className="flex-1">
      <Tabs
        tabBar={(props) => <BottomNav {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: "/",
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            href: "/market",
            title: "Market",
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            href: "/history",
            title: "History",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: "/profile",
            title: "Profile",
          }}
        />
      </Tabs>
    </View>
  );
}
