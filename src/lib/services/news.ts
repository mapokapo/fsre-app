import NewsArticle from "@/lib/types/NewsArticle";
import { mapError } from "@/lib/utils";
import { parse } from "date-fns";

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

const NEWS_CATEGORIES: NewsArticle["categories"] = [
  "FSRE web - Globalne objave",
  "FSRE web - Strojarstvo",
  "FSRE web - Računarstvo",
  "FSRE web - Elektrotehnika",
];

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

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    const res = await fetch("https://web-admin.sum.ba/api/web/objave", {
      method: "POST",
      body: JSON.stringify({
        page: 1,
        postsPerPage: 5,
        categories: NEWS_CATEGORIES,
        searchPhrase: "",
        searchContent: true,
      }),
      headers: {
        "Content-Type": "application/json",
        // API content is Croatian regardless of app locale.
        language: "hr",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news articles (${res.status})`);
    }

    const articles = (await res.json()) as NewsArticleApiResponse[];
    return articles.map(mapNewsArticle);
  } catch (error) {
    throw new Error(mapError(error));
  }
}
