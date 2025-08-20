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
import { Bell, HelpCircle, LogOut } from "lucide-react-native";

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
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Profil</ModalTitle>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>
      <ModalContent>
        <ProfileView />
      </ModalContent>
      <ModalFooter>
        <ModalActionButton
          onPress={() => onItemPress("notificationSettings")}
          icon={
            <Bell
              color="#0A4977"
              size={20}
              strokeWidth={2.5}
            />
          }
          text="Postavke obavijesti"
        />
        <ModalActionButton
          onPress={() => onItemPress("help")}
          icon={
            <HelpCircle
              color="#0A4977"
              size={20}
              strokeWidth={2.5}
            />
          }
          text="Pomoć"
        />
        <ModalActionButton
          onPress={() => onItemPress("logout")}
          style={{
            borderColor: "#FEE2E2",
            backgroundColor: "#FEFEFE",
          }}
          icon={
            <LogOut
              color="#DC2626"
              size={20}
              strokeWidth={2.5}
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
              }}
            />
          }
          text="Odjavi se"
          textStyle={{
            color: "#DC2626",
          }}
        />
      </ModalFooter>
    </Modal>
  );
}
