import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Github, Link, Linkedin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";

export type CreditsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function CreditsModal({
  isVisible,
  onClose,
}: Readonly<CreditsModalProps>) {
  const { colorScheme } = useColorScheme();
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
            <DialogTitle>{t("common.credits")}</DialogTitle>
          </DialogHeader>
          <View className="mt-6 flex-col gap-6">
            <View>
              <Text className="text-center font-bold">Leo Petrović</Text>
              <Text className="text-center">Developer & Designer</Text>
              <View className="mx-auto flex-row gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  size="icon"
                  onPress={() => {
                    Linking.openURL("https://leopetrovic.vercel.app");
                  }}>
                  <Icon
                    as={Link}
                    size={16}
                    strokeWidth={1.5}
                  />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  size="icon"
                  onPress={() => {
                    Linking.openURL("https://github.com/mapokapo");
                  }}>
                  <Icon
                    as={Github}
                    size={16}
                    strokeWidth={1.5}
                  />
                </Button>
              </View>
            </View>
            <View>
              <Text className="text-center font-bold">Vedran Marić</Text>
              <Text className="text-center">Developer & Organization</Text>
              <View className="mx-auto flex-row gap-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  size="icon"
                  onPress={() => {
                    Linking.openURL(
                      "https://www.linkedin.com/in/vedran-mari%C4%87-792033173/"
                    );
                  }}>
                  <Icon
                    as={Linkedin}
                    size={16}
                    strokeWidth={1.5}
                  />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded-full"
                  size="icon"
                  onPress={() => {
                    Linking.openURL("https://github.com/vedran-maric");
                  }}>
                  <Icon
                    as={Github}
                    size={16}
                    strokeWidth={1.5}
                  />
                </Button>
              </View>
            </View>
          </View>
        </LinearGradient>
      </DialogContent>
    </Dialog>
  );
}
