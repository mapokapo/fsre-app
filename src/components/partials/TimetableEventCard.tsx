import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import TimetableEvent from "@/lib/types/TimetableEvent";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookOpen,
  Calendar,
  Clock,
  LucideIcon,
  MapPin,
  User,
  Users,
  Zap,
} from "lucide-react-native";
import { ColorValue, View } from "react-native";

export type TimetableEventCardProps = {
  event: TimetableEvent;
  gradients: [ColorValue, ColorValue][];
};

export default function TimetableEventCard({
  event,
  gradients,
}: TimetableEventCardProps) {
  const { colorScheme } = useColorScheme();

  const getIndexByType = (event: TimetableEvent) => {
    switch (event.type) {
      case "lecture":
        return 0;
      case "exercise":
        return 1;
      case "labs":
        return 2;
      default:
        return 3;
    }
  };

  const getIconByType = (event: TimetableEvent): LucideIcon => {
    switch (event.type) {
      case "lecture":
        return BookOpen;
      case "exercise":
        return Users;
      case "labs":
        return Zap;
      default:
        return Calendar;
    }
  };

  return (
    <Button className="mb-4 h-auto justify-stretch overflow-hidden rounded-2xl p-0 shadow-md">
      <LinearGradient
        colors={[
          THEME[colorScheme].cardGradient1,
          THEME[colorScheme].cardGradient2,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full p-5">
        <View className="mb-4 flex-row items-center gap-2">
          <LinearGradient
            colors={gradients[getIndexByType(event)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            <Icon
              as={getIconByType(event)}
              size={24}
            />
          </LinearGradient>

          <View className="flex-1">
            <Text>{event.subject}</Text>
            <View className="flex-row flex-wrap items-center gap-1">
              <Text className="text-sm text-muted-foreground">
                {event.year}. godina
              </Text>
              <View className="mx-1 h-1 w-1 rounded-full bg-muted-foreground" />
              <Text className="text-sm text-muted-foreground">
                {event.department.name}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-4 border-t border-border pt-4">
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={Clock} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {event.startTime} - {event.endTime}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={MapPin} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {event.classroom.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Icon as={User} />
            </View>
            <Text className="text-sm text-muted-foreground">
              {event.teacher.name}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Button>
  );
}
