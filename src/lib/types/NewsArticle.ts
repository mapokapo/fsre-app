export default interface NewsArticle {
  id: number;
  title: string;
  subtitle: string | null;
  views: number;
  content: string;
  imageUrl: string;
  datetime: Date;
  link: string;
  categories: (
    | "FSRE web - Globalne objave"
    | "FSRE web - Strojarstvo"
    | "FSRE web - Računarstvo"
    | "FSRE web - Elektrotehnika"
  )[];
}
