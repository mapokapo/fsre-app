import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Filter } from "lucide-react-native";

export type TimetableFilterHeaderButtonProps = {
  onPress: () => void;
};

export default function TimetableFilterHeaderButton({
  onPress,
}: Readonly<TimetableFilterHeaderButtonProps>) {
  return (
    <Button
      className="rounded-full bg-white/20 p-6"
      size="icon"
      onPress={onPress}>
      <Icon
        as={Filter}
        className="text-fsre-gradient-foreground"
        size={24}
      />
    </Button>
  );
}
