import { describe, expect, test } from "bun:test";

import type NewsArticle from "@/lib/types/NewsArticle";
import {
  fuzzySearchNewsArticles,
  isTimetableQuestion,
} from "@/lib/utils/chatbotTools";

function makeArticle(
  overrides: Partial<NewsArticle> & Pick<NewsArticle, "id" | "title" | "content">
): NewsArticle {
  return {
    id: overrides.id,
    title: overrides.title,
    subtitle: null,
    views: 0,
    content: overrides.content,
    imageUrl: "",
    datetime: overrides.datetime ?? new Date("2026-01-01T10:00:00Z"),
    link: overrides.link ?? `https://example.com/${overrides.id}`,
    categories: overrides.categories ?? ["FSRE web - Globalne objave"],
  };
}

describe("isTimetableQuestion", () => {
  test("detects schedule and class timing questions", () => {
    expect(
      isTimetableQuestion(
        "When do the first classes of the current semester begin?"
      )
    ).toBe(true);
    expect(isTimetableQuestion("Kada počinju predavanja za PIIS?")).toBe(true);
  });

  test("does not flag unrelated questions", () => {
    expect(isTimetableQuestion("Kako se prijaviti na e-Learning?")).toBe(false);
  });
});

describe("fuzzySearchNewsArticles", () => {
  test("ranks exact phrase matches first", () => {
    const results = fuzzySearchNewsArticles(
      [
        makeArticle({
          id: 1,
          title: "Natječaj za stipendije",
          content: "Objavljen je natječaj za stipendije studentima.",
          datetime: new Date("2026-01-02T10:00:00Z"),
        }),
        makeArticle({
          id: 2,
          title: "Studentski zbor",
          content: "Sastanak studentskog zbora i aktivnosti.",
          datetime: new Date("2026-01-03T10:00:00Z"),
        }),
      ],
      "natječaj stipendije",
      5
    );

    expect(results.map(article => article.id)).toEqual([1]);
  });

  test("returns newest first when scores are equal", () => {
    const results = fuzzySearchNewsArticles(
      [
        makeArticle({
          id: 3,
          title: "Hackathon prijave",
          content: "Prijave za hackathon su otvorene.",
          datetime: new Date("2026-01-01T10:00:00Z"),
        }),
        makeArticle({
          id: 4,
          title: "Hackathon radionica",
          content: "Dodatna radionica prije hackathona.",
          datetime: new Date("2026-01-04T10:00:00Z"),
        }),
      ],
      "hackathon",
      5
    );

    expect(results.map(article => article.id)).toEqual([4, 3]);
  });
});
