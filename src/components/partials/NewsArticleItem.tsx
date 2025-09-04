import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { gradients } from "@/lib/const/gradients";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import i18n from "@/lib/i18n";
import { THEME } from "@/lib/theme";
import NewsArticle from "@/lib/types/NewsArticle";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { htmlToText } from "html-to-text";
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

const categoryNameToLabel = {
  "FSRE web - Globalne objave": i18n.t("news.categories.global"),
  "FSRE web - Strojarstvo": i18n.t("news.categories.mechanicalEngineering"),
  "FSRE web - Računarstvo": i18n.t("news.categories.computerScience"),
  "FSRE web - Elektrotehnika": i18n.t("news.categories.electricalEngineering"),
};

export default function NewsArticleItem({
  article,
  style,
  ...props
}: NewsArticleItemProps) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <Animated.View {...props}>
      <Button
        variant="ghost"
        className="mb-5 h-auto overflow-hidden rounded-2xl p-0 shadow-md web:flex-1"
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
            className="h-48 w-full"
          />
          <LinearGradient
            colors={[
              gradients[getIndexByCategory(article) % gradients.length]![0],
              gradients[getIndexByCategory(article) % gradients.length]![1],
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute left-4 top-4 overflow-hidden rounded-full px-4 py-2">
            <Text className="text-sm uppercase !text-primary-foreground">
              {article.categories[0] === undefined
                ? t("news.categories.default")
                : (categoryNameToLabel[article.categories[0]] ??
                  t("news.categories.default"))}
            </Text>
          </LinearGradient>
          <View className="p-5">
            <Text className="mb-6 text-lg font-semibold">{article.title}</Text>
            <Text className="mb-4 text-sm text-muted-foreground">
              {htmlToText(article.content)
                .replace(/\n{2,}/g, "")
                .slice(0, 100)}
              ...
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
