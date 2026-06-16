import TimetableEventCard from "@/components/partials/TimetableEventCard";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TimetableEvent } from "@/lib/api/client";
import { THEME } from "@/lib/theme";
import * as AccordionPrimitive from "@rn-primitives/accordion";
import { compareAsc } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown } from "lucide-react-native";
import { useMemo } from "react";
import { ColorValue, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export type TimetableDaySectionProps = {
  dayValue: string;
  events: TimetableEvent[];
  dayLabel: string;
  gradients: [ColorValue, ColorValue][];
  colorScheme: "light" | "dark";
};

function TimetableDayHeader({
  dayLabel,
  eventCount,
  colorScheme,
}: Readonly<{
  dayLabel: string;
  eventCount: number;
  colorScheme: "light" | "dark";
}>) {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(
    () =>
      isExpanded
        ? withTiming(1, { duration: 250 })
        : withTiming(0, { duration: 200 }),
    [isExpanded]
  );
  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${progress.value * 180}deg` }],
    }),
    [progress]
  );

  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger asChild>
        <Pressable className="mb-4">
          <LinearGradient
            colors={[
              THEME[colorScheme].fsreGradient1,
              THEME[colorScheme].fsreGradient2,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center justify-between overflow-hidden rounded-2xl px-4 py-3">
            <Text className="text-lg text-fsre-gradient-foreground">
              {dayLabel}
            </Text>
            <View className="flex-row items-center gap-2">
              <Animated.View style={chevronStyle}>
                <Icon
                  as={ChevronDown}
                  className="text-fsre-gradient-foreground"
                  size={20}
                />
              </Animated.View>
              <Text className="rounded-full bg-primary/80 px-4 py-2 font-semibold text-primary-foreground">
                {eventCount}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export default function TimetableDaySection({
  dayValue,
  events,
  dayLabel,
  gradients,
  colorScheme,
}: Readonly<TimetableDaySectionProps>) {
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => compareAsc(a.startDateTime, b.startDateTime)),
    [events]
  );

  return (
    <AccordionItem
      className="mb-2 border-0"
      value={dayValue}>
      <TimetableDayHeader
        colorScheme={colorScheme}
        dayLabel={dayLabel}
        eventCount={events.length}
      />
      <AccordionContent className="pb-0">
        {sortedEvents.map(event => (
          <TimetableEventCard
            key={`${event.id}-${event.startDateTime}-${event.endDateTime}`}
            event={event}
            gradients={gradients}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
