import translationEn from "./locales/en/translations.json";
import translationHr from "./locales/hr/translations.json";

export const resources = {
  en: { translation: translationEn },
  hr: { translation: translationHr },
} as const;

export type SupportedLanguage = keyof typeof resources;
export const supportedLanguages = Object.keys(resources) as SupportedLanguage[];

export const defaultLanguage: SupportedLanguage = "hr";

export const fallbackLng = {
  ...Object.fromEntries(
    supportedLanguages.map(lang => [
      lang,
      lang === defaultLanguage ? [lang] : [lang, defaultLanguage],
    ])
  ),
  default: [defaultLanguage],
};
