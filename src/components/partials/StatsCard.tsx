import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import Stat from "@/lib/types/Stat";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type StatsCardProps = AnimatedProps<ViewProps> & {
  stat: Stat;
};

export default function StatsCard({
  stat,
  className,
  ...props
}: StatsCardProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Animated.View
      className={cn("flex-1 overflow-hidden rounded-xl", className)}
      {...props}>
      <LinearGradient
        colors={[
          THEME[colorScheme].cardGradient1,
          THEME[colorScheme].cardGradient2,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="grow items-center px-3 py-5 shadow-md">
        <View
          className="mb-2 overflow-hidden rounded-full p-3"
          style={{ backgroundColor: stat.color.withAlpha(0.4).toHex() }}>
          <Icon
            className="h-6 w-6"
            as={stat.icon}
          />
        </View>
        <Text className="text-lg font-bold">{stat.value}</Text>
        <Text className="text-center text-sm text-muted-foreground">
          {stat.label}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}
