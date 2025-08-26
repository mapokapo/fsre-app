import { Button, ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";

export type SectionButtonProps = Omit<ButtonProps, "children"> & {
  title: string;
};

export default function SectionButton({
  title,
  className,
  ...props
}: SectionButtonProps) {
  return (
    <Button
      variant="secondary"
      className={cn("rounded-full pr-3", className)}
      {...props}>
      <Text>{title}</Text>
      <Icon as={ChevronRight} />
    </Button>
  );
}
