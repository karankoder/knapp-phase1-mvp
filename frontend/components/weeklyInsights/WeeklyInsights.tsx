import React, { useState } from "react";
import { WeeklyInsightsCard } from "./WeeklyInsightsCard";
import { WeeklyInsightsModal } from "./WeeklyInsightsModal";

export const WeeklyInsights = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <WeeklyInsightsCard onPress={() => setIsExpanded(true)} />
      <WeeklyInsightsModal
        visible={isExpanded}
        onClose={() => setIsExpanded(false)}
      />
    </>
  );
};
