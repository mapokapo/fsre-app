import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { gradients } from "@/lib/const/gradients";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import NewsArticle from "@/lib/types/NewsArticle";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { parse } from "node-html-parser";
import { useTranslation } from "react-i18next";
import { Image, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type NewsArticleItemProps = AnimatedProps<ViewProps> & {
  article: NewsArticle;
};

const getIndexByCategory = (article: NewsArticle) => {
  if (article.categories.includes("FSRE web - Globalne objave")) {
    return 0;
  }

  switch (article.categories[0]) {
    case "FSRE web - Strojarstvo":
      return 1;
    case "FSRE web - Računarstvo":
      return 2;
    case "FSRE web - Elektrotehnika":
      return 3;
    default:
      return 4;
  }
};

const categoryKeys = {
  "FSRE web - Globalne objave": "news.categories.global",
  "FSRE web - Strojarstvo": "news.categories.mechanicalEngineering",
  "FSRE web - Računarstvo": "news.categories.computerScience",
  "FSRE web - Elektrotehnika": "news.categories.electricalEngineering",
} as const;

export default function NewsArticleItem({
  article,
  style,
  ...props
}: NewsArticleItemProps) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const gradientIndex = getIndexByCategory(article) % gradients.length;
  const categoryGradient = gradients[gradientIndex]!;
  const preview = parse(article.content).text.replace(/\n{2,}/g, "");
  const excerpt =
    preview.length > 100 ? `${preview.slice(0, 100)}...` : preview;
  const category = article.categories[0];
  const categoryLabel =
    category === undefined
      ? t("news.categories.default")
      : category in categoryKeys
        ? t(categoryKeys[category])
        : t("news.categories.default");

  return (
    <Animated.View {...props}>
      <Button
        variant="ghost"
        className="mb-5 h-auto overflow-hidden rounded-2xl p-0 shadow-md web:mb-0 web:flex-1"
        onPress={() => {
          Linking.openURL(article.link);
        }}>
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-full w-full">
          <Image
            source={{
              uri: `https://web-admin.sum.ba/api/storage/${article.imageUrl}`,
            }}
            className="aspect-video h-auto w-full"
          />
          <LinearGradient
            colors={[categoryGradient[0], categoryGradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute left-4 top-4 overflow-hidden rounded-full px-4 py-2">
            <Text className="text-sm uppercase !text-primary-foreground">
              {categoryLabel}
            </Text>
          </LinearGradient>
          <View className="p-5">
            <Text className="mb-6 line-clamp-3 text-lg font-semibold">
              {article.title}
            </Text>
            <Text className="mb-4 text-sm text-muted-foreground">
              {excerpt}
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
