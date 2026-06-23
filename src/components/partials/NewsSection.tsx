import ErrorMessage from "@/components/ErrorMessage";
import NewsArticleItem from "@/components/partials/NewsArticleItem";
import { fetchNewsArticles } from "@/lib/services/news";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

export default function NewsSection() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["newsArticles"],
    queryFn: fetchNewsArticles,
  });

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size={64}
          className="text-fsre-gradient-3"
        />
      </View>
    );
  }

  if (error && !data) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <View className="flex w-full flex-col overflow-x-scroll web:flex-row web:gap-8 web:px-2 web:pb-4">
      {data?.map(article => (
        <NewsArticleItem
          key={article.id}
          article={article}
          className="web:max-w-96"
        />
      ))}
    </View>
  );
}
