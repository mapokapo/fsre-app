import ErrorMessage from "@/components/ErrorMessage";
import NewsArticleItem from "@/components/partials/NewsArticleItem";
import NewsArticle from "@/lib/types/NewsArticle";
import { useQuery } from "@tanstack/react-query";
import { parse } from "date-fns";
import { ActivityIndicator, View } from "react-native";

export default function NewsSection() {
  const { data, isFetching, error } = useQuery({
    queryKey: ["newsArticles"],
    queryFn: async () =>
      fetch("https://web-admin.sum.ba/api/web/objave", {
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
      })
        .then(res => res.json())
        .then(
          res =>
            res.map(
              (a: any) =>
                ({
                  id: a.id,
                  title: a.title,
                  subtitle: a.subtitle,
                  views: a.views,
                  content: a.content,
                  link: `https://fsre.sum.ba/novosti/${a.alias}`,
                  datetime: parse(
                    a.created_at,
                    "dd.MM.yyyy HH:mm:ss",
                    new Date()
                  ),
                  imageUrl: a.image,
                  categories: a.categories,
                }) satisfies NewsArticle
            ) as NewsArticle[]
        ),
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
