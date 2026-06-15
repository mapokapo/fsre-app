import ErrorMessage from "@/components/ErrorMessage";
import NewsArticleItem from "@/components/partials/NewsArticleItem";
import NewsArticle from "@/lib/types/NewsArticle";
import { useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";
import { ActivityIndicator, View } from "react-native";

type NewsArticleApiResponse = {
  id: number;
  title: string;
  subtitle: string | null;
  views: number;
  content: string;
  alias: string;
  created_at: string;
  image: string;
  categories: NewsArticle["categories"];
};

function mapNewsArticle(article: NewsArticleApiResponse): NewsArticle {
  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    views: article.views,
    content: article.content,
    link: `https://fsre.sum.ba/novosti/${article.alias}`,
    datetime: parse(article.created_at, "dd.MM.yyyy HH:mm:ss", new Date()),
    imageUrl: article.image,
    categories: article.categories,
  };
}

export default function NewsSection() {
  const { data, isFetching, error } = useQuery({
    queryKey: ["newsArticles"],
    queryFn: async () => {
      const res = await fetch("https://web-admin.sum.ba/api/web/objave", {
        method: "POST",
        body: JSON.stringify({
          page: 1,
          postsPerPage: 5,
          categories: [
            "FSRE web - Globalne objave",
            "FSRE web - Strojarstvo",
            "FSRE web - Računarstvo",
            "FSRE web - Elektrotehnika",
          ],
          searchPhrase: "",
          searchContent: true,
        }),
        headers: {
          "Content-Type": "application/json",
          language: "hr",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch news articles (${res.status})`);
      }

      const articles = (await res.json()) as NewsArticleApiResponse[];
      return articles.map(mapNewsArticle);
    },
  });

  if (isFetching)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size={64}
          className="text-fsre-gradient-3"
        />
      </View>
    );
  if (error) return <ErrorMessage error={error} />;

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
