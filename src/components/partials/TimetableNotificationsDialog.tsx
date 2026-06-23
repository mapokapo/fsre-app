import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Bell } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export type TimetableNotificationsDialogProps = {
  isVisible: boolean;
  onContinue: () => void;
};

export default function TimetableNotificationsDialog({
  isVisible,
  onContinue,
}: Readonly<TimetableNotificationsDialogProps>) {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <Dialog
      open={isVisible}
      onOpenChange={open => {
        if (!open) onContinue();
      }}
      className="shadow-md">
      <DialogContent className="w-80 overflow-hidden rounded-2xl p-0 md:w-96">
        <LinearGradient
          colors={[
            THEME[colorScheme].cardGradient1,
            THEME[colorScheme].cardGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="p-6">
          <DialogHeader className="items-center">
            <View className="mb-2 rounded-full bg-primary/10 p-3">
              <Icon
                as={Bell}
                className="text-primary"
                size={28}
              />
            </View>
            <DialogTitle className="text-center">
              {t("timetable.notifications.title")}
            </DialogTitle>
            <DialogDescription className="text-center">
              <Text className="text-sm text-muted-foreground">
                {t("timetable.notifications.description")}
              </Text>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button className="w-full">
                <Text>{t("timetable.notifications.continue")}</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
