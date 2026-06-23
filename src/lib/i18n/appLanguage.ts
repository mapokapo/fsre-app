import i18n from "i18next";

import {
  defaultLanguage,
  resources,
  type SupportedLanguage,
} from "./resources";

export function getAppLanguageCode(): SupportedLanguage {
  const code = i18n.language.split("-")[0];
  if (code && code in resources) {
    return code as SupportedLanguage;
  }
  return defaultLanguage;
}
