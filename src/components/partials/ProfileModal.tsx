import {
  Modal,
  ModalActionButton,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/modal";
import ProfileView from "@/components/partials/ProfileView";
import ThemeToggle from "@/components/ThemeToggle";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { Bell, HelpCircle, LogOut } from "lucide-react-native";
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

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Profil</ModalTitle>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>
      <ModalContent>
        <View className="mb-4 flex-row items-center gap-2">
          <Text>{isDarkColorScheme ? "Tamni" : "Svijetli"} način</Text>
          <ThemeToggle />
        </View>
        <ProfileView />
      </ModalContent>
      <ModalFooter>
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
          text="Postavke obavijesti"
        />
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
          text="Pomoć"
        />
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
          text="Odjavi se"
        />
      </ModalFooter>
    </Modal>
  );
}
