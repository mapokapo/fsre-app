import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SettingsIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export type SettingsHeaderButtonProps = {
  onPress: () => void;
};

export default function SettingsHeaderButton({
  onPress,
}: Readonly<SettingsHeaderButtonProps>) {
  const { t } = useTranslation();

  return (
    <Button
      className="rounded-full bg-white/20 p-6"
      size="icon"
      accessibilityLabel={t("accessibility.settings")}
      onPress={onPress}>
      <Icon
        as={SettingsIcon}
        className="text-primary-foreground"
        size={24}
      />
    </Button>
  );
}
