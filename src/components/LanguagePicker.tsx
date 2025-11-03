import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { storage } from "@/lib/const/storage";
import {
  LANGUAGE_KEY,
  SupportedLanguage,
  supportedLanguages,
} from "@/lib/i18n";
import { useTranslation } from "react-i18next";

export default function LanguagePicker() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
    storage.set(LANGUAGE_KEY, lang);
  };

  return (
    <Select
      value={{
        value: i18n.language,
        label: t(`common.languages.${i18n.language}`),
      }}
      onValueChange={val => {
        if (val) changeLanguage(val.value as SupportedLanguage);
      }}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("common.chooseLanguage")}>
          <Text>{t(`common.languages.${i18n.language}`)}</Text>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map(lang => (
          <SelectItem
            key={lang}
            label={t(`common.languages.${lang}`)}
            value={lang}
          />
        ))}
      </SelectContent>
    </Select>
  );
}
