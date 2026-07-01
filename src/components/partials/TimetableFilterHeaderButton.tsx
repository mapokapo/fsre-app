import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Filter } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export type TimetableFilterHeaderButtonProps = {
  onPress: () => void;
};

export default function TimetableFilterHeaderButton({
  onPress,
}: Readonly<TimetableFilterHeaderButtonProps>) {
  const { t } = useTranslation();

  return (
    <Button
      className="rounded-full bg-white/20 p-6"
      size="icon"
      accessibilityLabel={t("accessibility.timetableFilters")}
      onPress={onPress}>
      <Icon
        as={Filter}
        className="text-fsre-gradient-foreground"
        size={24}
      />
    </Button>
  );
}
