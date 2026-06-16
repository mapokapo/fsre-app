import LanguagePicker from "@/components/LanguagePicker";
import { ModalActionButton } from "@/components/modal";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  Copyright,
  HelpCircle,
  Languages,
  Paintbrush,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export type SettingsMenuItem = "help" | "credits";

export type SettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onItemPress: (item: SettingsMenuItem) => void;
};

export default function SettingsModal({
  isVisible,
  onClose,
  onItemPress,
}: Readonly<SettingsModalProps>) {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();

  return (
    <Dialog
      open={isVisible}
      onOpenChange={open => {
        if (!open) onClose();
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
          <DialogHeader>
            <DialogTitle>{t("settings.title")}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-6 !flex-col gap-3">
            <ModalActionButton
              isButton={false}
              icon={
                <Icon
                  as={Paintbrush}
                  color={THEME[colorScheme].fsreGradient3}
                  size={20}
                  strokeWidth={2.5}
                />
              }
              text={
                isDarkColorScheme
                  ? t("settings.darkMode")
                  : t("settings.lightMode")
              }>
              <ThemeToggle />
            </ModalActionButton>
            <ModalActionButton
              isButton={false}
              icon={
                <Icon
                  as={Languages}
                  color={THEME[colorScheme].fsreGradient3}
                  size={20}
                  strokeWidth={2.5}
                />
              }>
              <View className="flex-1">
                <LanguagePicker />
              </View>
            </ModalActionButton>
            <ModalActionButton
              onPress={() => onItemPress("help")}
              icon={
                <Icon
                  as={HelpCircle}
                  color={THEME[colorScheme].fsreGradient3}
                  size={20}
                  strokeWidth={2.5}
                />
              }
              text={t("common.help")}
            />
            <ModalActionButton
              onPress={() => onItemPress("credits")}
              icon={
                <Icon
                  as={Copyright}
                  color={THEME[colorScheme].fsreGradient3}
                  size={20}
                  strokeWidth={2.5}
                />
              }
              text={t("common.credits")}
            />
          </DialogFooter>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
