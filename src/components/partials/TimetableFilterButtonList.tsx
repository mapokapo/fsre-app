import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { TimetableFilter } from "@/lib/types/TimetableFilter";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, ScrollView, View } from "react-native";

export type TimetableFilterButtonListProps = {
  label: string;
  filters: TimetableFilter[];
  gradients: [ColorValue, ColorValue][];
  selectedFilter: TimetableFilter | null;
  onSelect: (filter: TimetableFilter) => void;
};

export default function TimetableFilterButtonList({
  label,
  filters,
  gradients,
  selectedFilter,
  onSelect,
}: TimetableFilterButtonListProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View>
      <Text className="mb-1 ml-1 text-sm text-muted-foreground">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {filters.map((filter, i) => (
          <Button
            key={filter.key}
            className="overflow-hidden rounded-full p-0"
            onPress={() => onSelect(filter)}>
            <LinearGradient
              colors={
                filter.key === selectedFilter?.key
                  ? gradients[i % gradients.length]
                  : [
                      THEME[colorScheme].cardGradient1,
                      THEME[colorScheme].cardGradient2,
                    ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-full justify-center px-4">
              <Text
                className={cn(
                  "text-sm text-muted-foreground",
                  filter.key === selectedFilter?.key &&
                    "text-fsre-gradient-foreground"
                )}>
                {filter.name}
              </Text>
            </LinearGradient>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}
