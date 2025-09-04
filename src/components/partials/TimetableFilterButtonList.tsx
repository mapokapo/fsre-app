import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { gradients } from "@/lib/const/gradients";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import TimetableFilter from "@/lib/types/TimetableFilter";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { ColorValue, ScrollView, View } from "react-native";

export type TimetableFilterButtonListProps<T> = {
  label: string;
  filters: TimetableFilter<T>[];
  selectedFilter: TimetableFilter<T> | null;
  onSelect: (filter: TimetableFilter<T>) => void;
};

export default function TimetableFilterButtonList<T>({
  label,
  filters,
  selectedFilter,
  onSelect,
}: TimetableFilterButtonListProps<T>) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text className="mb-1 ml-1 text-sm text-muted-foreground">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {filters.map((filter, i) => (
          <Button
            key={`${filter.value}`}
            className="overflow-hidden rounded-full p-0"
            onPress={() => onSelect(filter)}>
            <LinearGradient
              colors={
                filter.value === selectedFilter?.value
                  ? (gradients[i % gradients.length] as [
                      ColorValue,
                      ColorValue,
                    ])
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
                  filter.value === selectedFilter?.value &&
                    "text-fsre-gradient-foreground"
                )}>
                {filter.label(t)}
              </Text>
            </LinearGradient>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}
