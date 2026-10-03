import type NewsArticle from "@/lib/types/NewsArticle";

const TIMETABLE_KEYWORDS = [
  "raspored",
  "satnica",
  "predavanje",
  "predavanja",
  "vjezbe",
  "vježbe",
  "termin",
  "ucionica",
  "učionica",
  "timetable",
  "schedule",
  "class",
  "classes",
  "lecture",
  "lectures",
  "when",
  "kada",
  "datum",
  "date",
  "week",
  "tjedan",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9]+/g)
    .filter(token => token.length >= 2);
}

export function isTimetableQuestion(text: string): boolean {
  const normalized = normalizeText(text);
  return TIMETABLE_KEYWORDS.some(keyword => normalized.includes(keyword));
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, " ");
}

export function fuzzySearchNewsArticles(
  articles: NewsArticle[],
  query: string,
  limit: number
): NewsArticle[] {
  const normalizedQuery = normalizeText(query).trim();
  if (normalizedQuery.length < 2) return [];

  const queryTokens = tokenize(normalizedQuery);
  if (queryTokens.length === 0) return [];

  const scored = articles
    .map(article => {
      const searchableText = normalizeText(
        `${article.title} ${article.subtitle ?? ""} ${stripHtml(article.content)}`
      );
      const matchedTokens = queryTokens.filter(token =>
        searchableText.includes(token)
      ).length;

      const tokenScore = matchedTokens / queryTokens.length;
      const phraseBonus = searchableText.includes(normalizedQuery) ? 2 : 0;
      const score = tokenScore + phraseBonus;

      return { article, score };
    })
    .filter(entry => entry.score > 0);

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.article.datetime.getTime() - a.article.datetime.getTime();
    })
    .slice(0, limit)
    .map(entry => entry.article);
}
