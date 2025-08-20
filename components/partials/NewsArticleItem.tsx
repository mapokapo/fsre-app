import NewsArticle from "@/lib/types/NewsArticle";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type NewsArticleItemProps = {
  article: NewsArticle;
};

export default function NewsArticleItem({ article }: NewsArticleItemProps) {
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
    <Pressable
      style={styles.article}
      onPress={() => {
        Linking.openURL(article.link);
      }}>
      <View style={styles.articleImageContainer}>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.articleImage}
        />
        <LinearGradient
          colors={[article.gradientFrom, article.gradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.articleCategoryBadge}>
          <Text style={styles.articleCategoryText}>
            {getCategoryLabel(article.categoryCode)}
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleSummary}>{article.summary}</Text>
        <Text style={styles.articleTime}>
          {getDistanceTo(article.datetime)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  article: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    marginBottom: 22,
    overflow: "hidden",
    boxShadow: "0px 8px 20px rgba(10, 73, 119, 0.12)",
    elevation: 10,
  },
  articleImageContainer: {
    position: "relative",
  },
  articleImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  articleCategoryBadge: {
    position: "absolute",
    top: 18,
    left: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  articleCategoryText: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  articleContent: {
    padding: 22,
  },
  articleTitle: {
    fontSize: 19,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 10,
    lineHeight: 26,
  },
  articleSummary: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 14,
  },
  articleTime: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#94A3B8",
  },
});
