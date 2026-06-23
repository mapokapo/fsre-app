import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";
import { Alert, Linking, View } from "react-native";

export type ContactItemAction =
  | { type: "phone"; value: string }
  | { type: "email"; value: string }
  | { type: "address"; value: string };

export type ContactItemProps = {
  title: string;
  icon?: React.ReactNode;
  action: ContactItemAction;
};

function getActionUrl(action: ContactItemAction): string {
  switch (action.type) {
    case "phone":
      return `tel:${action.value}`;
    case "email":
      return `mailto:${action.value}`;
    case "address":
      return `https://maps.google.com/?q=${encodeURIComponent(action.value)}`;
  }
}

export default function ContactItem({
  title,
  icon,
  action,
}: Readonly<ContactItemProps>) {
  const { t } = useTranslation();

  const handlePress = async () => {
    const url = getActionUrl(action);

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(t("common.error"), t("common.linkOpenFailed"));
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(t("common.error"), t("common.linkOpenFailed"));
    }
  };

  return (
    <Button
      variant="ghost"
      className="h-auto flex-row items-center justify-start p-0"
      onPress={() => {
        void handlePress();
      }}>
      <View className="mr-4 h-12 w-12 items-center justify-center overflow-hidden rounded-full">
        {icon}
      </View>
      <Text className="flex-1">{title}</Text>
    </Button>
  );
}
