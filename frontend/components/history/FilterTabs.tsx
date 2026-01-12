import React from "react";
import { View, Text, Pressable } from "react-native";
import { MotiView } from "moti";

export type FilterType = "all" | "receive" | "send";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "receive", label: "Received" },
  { value: "send", label: "Sent" },
];

export const FilterTabs = ({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) => {
  return (
    <View className="flex-row gap-2 mb-8">
      {FILTERS.map((filter, index) => {
        const isActive = activeFilter === filter.value;

        return (
          <MotiView
            key={filter.value}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 300, delay: index * 80 }}
          >
            <Pressable
              onPress={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-xl ${
                isActive
                  ? "bg-champagne"
                  : "bg-[#0e0d10] border border-champagne/10"
              } active:opacity-80`}
            >
              <Text
                numberOfLines={1}
                className={`text-sm font-rajdhani-semibold uppercase tracking-wider ${
                  isActive ? "text-[#0A0A0A]" : "text-champagne/70"
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
};
