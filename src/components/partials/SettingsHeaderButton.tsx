import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SettingsIcon } from "lucide-react-native";

export type SettingsHeaderButtonProps = {
  onPress: () => void;
};

export default function SettingsHeaderButton({
  onPress,
}: Readonly<SettingsHeaderButtonProps>) {
  return (
    <Button
      className="rounded-full bg-white/20 p-6"
      size="icon"
      onPress={onPress}>
      <Icon
        as={SettingsIcon}
        className="text-primary-foreground"
        size={24}
      />
    </Button>
  );
}
