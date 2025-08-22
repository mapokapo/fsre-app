import Stat from "@/lib/types/Stat";
import React from "react";
import { ColorValue, StyleSheet, Text, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type StatsCardProps = AnimatedProps<ViewProps> & {
  stat: Stat;
};

export default function StatsCard({ stat, style, ...props }: StatsCardProps) {
  return (
    <Animated.View
      style={[styles.statCard, style]}
      {...props}>
      <View
        style={[
          styles.statIcon,
          { backgroundColor: stat.color.withAlpha(0.2).toHex() },
        ]}>
        {React.cloneElement(
          stat.icon as React.ReactElement<{
            color: ColorValue;
            size: number;
            strokeWidth: number;
          }>,
          {
            color: stat.color.toHex(),
            size: 22,
            strokeWidth: 2.5,
          }
        )}
      </View>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    boxShadow: "0px 6px 15px rgba(10, 73, 119, 0.1)",
    elevation: 8,
    minHeight: 120,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter-Medium",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 14,
  },
});
