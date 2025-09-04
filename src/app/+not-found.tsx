import { Text } from "@/components/ui/text";
import { Link, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-semibold">{t("notFound.message")}</Text>
        <Link
          href="/"
          className="mt-4 py-4">
          <Text>{t("notFound.linkText")}</Text>
        </Link>
      </View>
    </>
  );
}
