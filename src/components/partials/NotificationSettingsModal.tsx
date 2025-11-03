import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { notificationCategories } from "@/lib/const/notificationCategories";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { useNotificationSettingsStore } from "@/lib/state/notificationSettingsStore";
import { THEME } from "@/lib/theme";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";

export type NotificationSettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function NotificationSettingsModal({
  isVisible,
  onClose,
}: NotificationSettingsModalProps) {
  const { notificationSettings, setNotificationSettings } =
    useNotificationSettingsStore();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const toggleNotificationSetting = (
    category: keyof typeof notificationSettings
  ) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev],
    }));
  };

  const handleSaveNotificationSettings = () => {
    console.log("Saving notification settings:", notificationSettings);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={Platform.select({
        native: ["85%", "50%"],
        web: ["100%"],
      })}
      maxDynamicContentSize={400}
      containerStyle={{
        marginTop: -40,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      backdropComponent={() => (
        <View className="absolute h-full w-full opacity-0"></View>
      )}
      onDismiss={onClose}
      handleStyle={{
        backgroundColor: THEME[colorScheme].cardGradient1,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: THEME[colorScheme].cardForeground,
      }}
      backgroundStyle={{
        backgroundColor: THEME[colorScheme].cardGradient1,
      }}>
      <BottomSheetScrollView className="-mb-10 flex-1">
        <View className="rounded-tl-lg rounded-tr-lg shadow-lg">
          <View className="flex-row items-center justify-between border-b border-border bg-card-gradient-1 px-6 pb-4 pt-9">
            <Text className="text-xl font-bold">
              {t("notifications.settings.title")}
            </Text>
            <Button
              size="icon"
              onPress={onClose}>
              <Icon
                as={X}
                className="text-fsre-gradient-foreground web:!h-full web:!w-full web:!p-2"
                size={24}
                strokeWidth={2.5}
              />
            </Button>
          </View>

          <View className="flex-1 bg-background p-6 pt-4">
            <Text className="mb-6 text-center text-sm text-muted-foreground">
              {t("notifications.settings.description")}
            </Text>

            <View className="mb-8 gap-4">
              {notificationCategories.map(category => (
                <View
                  key={category.key}
                  className="rounded-xl border border-border bg-card-gradient-1 shadow-sm">
                  <View className="flex-row items-center justify-between p-4">
                    <View className="flex-1 flex-row items-center">
                      <LinearGradient
                        colors={[category.gradientFrom, category.gradientTo]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="mr-4 h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                        <Icon
                          as={category.icon}
                          className="text-fsre-gradient-foreground"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </LinearGradient>

                      <View className="flex-1">
                        <Text className="mb-1 font-semibold">
                          {category.title(t)}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {category.description(t)}
                        </Text>
                      </View>
                    </View>

                    <Switch
                      checked={notificationSettings[category.key]}
                      onCheckedChange={() =>
                        toggleNotificationSetting(category.key)
                      }
                      id={`notification-switch-${category.key}`}
                      nativeID={`notification-switch-${category.key}`}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Button
              className="mb-4 h-auto py-4"
              onPress={handleSaveNotificationSettings}>
              <Text className="text-base font-bold">
                {t("notifications.settings.save")}
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
