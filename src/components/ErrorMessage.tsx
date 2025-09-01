import { Text } from "@/components/ui/text";
import { mapError } from "@/lib/utils";
import { View } from "react-native";

export type ErrorMessageProps = {
  error: unknown;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="rounded-lg bg-destructive/30 p-4">
        <Text className="text-center text-xl font-bold">Error</Text>
        <Text className="text-center">{mapError(error)}</Text>
      </View>
    </View>
  );
}
