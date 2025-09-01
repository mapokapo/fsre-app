import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { gradients } from "@/lib/const/gradients";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import NewsArticle from "@/lib/types/NewsArticle";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { htmlToText } from "html-to-text";
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

const getCategoryLabel = (category: NewsArticle["categories"]) => {
  if (category.includes("FSRE web - Globalne objave")) {
    return "Globalno";
  }

  switch (category[0]) {
    case "FSRE web - Strojarstvo":
      return "Strojarstvo";
    case "FSRE web - Računarstvo":
      return "Računarstvo";
    case "FSRE web - Elektrotehnika":
      return "Elektrotehnika";
    default:
      return "Vijesti";
  }
};

export default function NewsArticleItem({
  article,
  style,
  ...props
}: NewsArticleItemProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Animated.View {...props}>
      <Button
        variant="ghost"
        className="mb-5 h-auto overflow-hidden rounded-2xl p-0 shadow-md web:flex-1"
        onPress={() => {
          console.log(article.link);

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
              {getCategoryLabel(article.categories)}
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
