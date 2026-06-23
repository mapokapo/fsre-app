import type { Locale } from "date-fns";
import * as dateFnsLocales from "date-fns/locale";

import { getAppLanguageCode } from "./appLanguage";
import { defaultLanguage } from "./resources";

// App language codes that differ from date-fns locale export names.
const LOCALE_CODE_ALIASES: Record<string, keyof typeof dateFnsLocales> = {
  en: "enUS",
};

// Per-language tweaks applied after resolving the base date-fns locale.
const LOCALE_CUSTOMIZERS: Record<string, (locale: Locale) => Locale> = {
  hr: locale => ({
    ...locale,
    formatDistance: (token, count, options) => {
      const formatDistance =
        locale.formatDistance ?? dateFnsLocales.hr.formatDistance;
      return formatDistance(token, count, options).replace("oko ", "").trim();
    },
  }),
};

function resolveDateFnsLocaleKey(
  language: string
): keyof typeof dateFnsLocales | undefined {
  const alias = LOCALE_CODE_ALIASES[language];
  if (alias) {
    return alias;
  }

  if (language in dateFnsLocales) {
    return language as keyof typeof dateFnsLocales;
  }

  return undefined;
}

function getBaseDateFnsLocale(language: string): Locale {
  const localeKey = resolveDateFnsLocaleKey(language);
  if (localeKey) {
    return dateFnsLocales[localeKey];
  }

  const fallbackKey = resolveDateFnsLocaleKey(defaultLanguage);
  if (fallbackKey) {
    return dateFnsLocales[fallbackKey];
  }

  return dateFnsLocales.hr;
}

export function getAppDateFnsLocale(): Locale {
  const language = getAppLanguageCode();
  const baseLocale = getBaseDateFnsLocale(language);
  const customize = LOCALE_CUSTOMIZERS[language];

  return customize ? customize(baseLocale) : baseLocale;
}
