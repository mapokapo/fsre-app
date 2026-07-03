import { storage } from "@/lib/const/storage";
import * as Localization from "expo-localization";
import i18n, { use as i18nUse } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import { defaultLanguage, fallbackLng, resources } from "./resources";

export { defaultLanguage, fallbackLng, supportedLanguages } from "./resources";
export type { SupportedLanguage } from "./resources";

const RTL_LANGUAGES: Set<string> = new Set();

export const LANGUAGE_KEY = "@app_language";

const initI18n = async () => {
  try {
    // Try to get saved language preference
    const savedLanguage = storage.getString(LANGUAGE_KEY);

    // Determine which language to use
    let selectedLanguage = savedLanguage;

    if (!selectedLanguage) {
      // If no saved language, use device locale or fallback
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales[0]?.languageTag ?? defaultLanguage;
      const languageCode = deviceLocale.split("-")[0]!;

      // Try exact locale match first
      if (deviceLocale in resources) {
        selectedLanguage = deviceLocale;
      }

      // Then try language code match
      else if (languageCode in resources) {
        selectedLanguage = languageCode;
      } else {
        selectedLanguage = defaultLanguage;
      }
    }

    // Handle RTL layout
    const isRTL = RTL_LANGUAGES.has(selectedLanguage);

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }

    await i18nUse(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

    // Save the selected language
    if (!savedLanguage) {
      storage.set(LANGUAGE_KEY, selectedLanguage);
    }
  } catch (error) {
    console.error("Error initializing i18n:", error);

    // Initialize with defaults if there's an error
    await i18nUse(initReactI18next).init({
      resources,
      lng: defaultLanguage,
      fallbackLng,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }
};

initI18n();

export { getAppLanguageCode } from "./appLanguage";
export { getAppDateFnsLocale } from "./dateLocales";

export default i18n;
