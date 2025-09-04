import StatsCard from "@/components/partials/StatsCard";
import MockData from "@/lib/const/mockData";
import { View, ViewProps, ViewStyle } from "react-native";

export type StatsSectionProps = ViewProps & {
  introAnimatedStyle: ViewStyle;
};

export default function StatsSection({
  introAnimatedStyle,
  ...props
}: StatsSectionProps) {
  return (
    <View
      {...props}
      className="mt-8 flex-row gap-4">
      {MockData.getStats().map(stat => (
        <StatsCard
          key={stat.key}
          stat={stat}
          style={introAnimatedStyle}
        />
      ))}
    </View>
  );
}
