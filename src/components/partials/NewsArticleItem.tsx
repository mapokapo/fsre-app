import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import NewsArticle from "@/lib/types/NewsArticle";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useCallback } from "react";
import { Image, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type NewsArticleItemProps = AnimatedProps<ViewProps> & {
  article: NewsArticle;
};

export default function NewsArticleItem({
  article,
  style,
  ...props
}: NewsArticleItemProps) {
  const { colorScheme } = useColorScheme();
  const getCategoryLabel = useCallback(
    (iconCode: typeof article.categoryCode) => {
      switch (iconCode) {
        case "tech":
          return "Tehnologija";
        case "awards":
          return "Natjecanja";
        case "labs":
          return "Laboratoriji";
        case "scholarships":
          return "Stipendije";
        case "lectures":
          return "Predavanja";
        default:
          return "Vijesti";
      }
    },
    [article]
  );

  return (
    <Animated.View {...props}>
      <Button
        variant="ghost"
        className="mb-5 h-auto overflow-hidden rounded-2xl p-0 shadow-md"
        onPress={() => {
          Linking.openURL(article.link);
        }}>
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <Image
            source={{ uri: article.imageUrl }}
            className="h-48 w-full"
          />
          <LinearGradient
            colors={[article.gradientFrom, article.gradientTo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute left-4 top-4 overflow-hidden rounded-full px-4 py-2">
            <Text className="text-sm uppercase">
              {getCategoryLabel(article.categoryCode)}
            </Text>
          </LinearGradient>
          <View className="p-5">
            <Text className="mb-6 text-lg font-semibold">{article.title}</Text>
            <Text className="mb-4 text-sm text-muted-foreground">
              {article.summary}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {getDistanceTo(article.datetime)}
            </Text>
          </View>
        </LinearGradient>
      </Button>
    </Animated.View>
  );
}
