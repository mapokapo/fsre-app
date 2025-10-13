import LanguagePicker from "@/components/LanguagePicker";
import { ModalActionButton } from "@/components/modal";
import ProfileView from "@/components/partials/ProfileView";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import MockData from "@/lib/const/mockData";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  HelpCircle,
  Languages,
  LogOut,
  Paintbrush,
} from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export type ProfileModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onItemPress: (item: string) => void;
};

export default function ProfileModal({
  isVisible,
  onClose,
  onItemPress,
}: ProfileModalProps) {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();
  const profile = useMemo(() => MockData.getProfile(), []);

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
            <DialogTitle>
              {t(profile !== undefined ? "profile.title" : "settings.title")}
            </DialogTitle>
          </DialogHeader>
          {profile && <ProfileView profile={profile} />}
          <DialogFooter className="mt-6 !flex-col gap-3">
            <ModalActionButton
              onPress={() => onItemPress("notificationSettings")}
              icon={
                <Icon
                  as={Bell}
                  color={THEME[colorScheme].fsreGradient3}
                  size={20}
                  strokeWidth={2.5}
                />
              }
              text={t("notifications.settings.title")}
            />
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
                  ? t("profile.darkMode")
                  : t("profile.lightMode")
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
            {profile && (
              <ModalActionButton
                onPress={() => onItemPress("logout")}
                destructive
                icon={
                  <Icon
                    as={LogOut}
                    color={THEME[colorScheme].fsreGradientForeground}
                    size={20}
                    strokeWidth={2.5}
                  />
                }
                text={t("common.logout")}
              />
            )}
          </DialogFooter>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
