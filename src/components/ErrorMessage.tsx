import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { mapError } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export type ErrorMessageProps = {
  error: unknown;
  onRetry?: () => void;
};

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center">
      <View className="rounded-lg bg-destructive/30 p-4">
        <Text className="text-center text-xl font-bold">
          {t("common.error")}
        </Text>
        <Text className="text-center">{mapError(error)}</Text>
        {onRetry && (
          <Button
            variant="outline"
            onPress={onRetry}
            className="mt-4">
            <Text>{t("common.refresh")}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
