import { notificationCategories } from "@/lib/const/notificationCategories";
import { useNotificationSettingsStore } from "@/lib/state/notificationSettingsStore";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

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
    // Here you would typically save to AsyncStorage or API
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
      snapPoints={["100%", "50%"]}
      containerStyle={styles.sheetBackground}
      onDismiss={onClose}>
      <BottomSheetScrollView>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Postavke obavijesti</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}>
              <X
                color="#64748B"
                size={20}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>

          {/* Notification Settings Content - Fixed */}
          <View style={styles.notificationContent}>
            <Text style={styles.notificationDescription}>
              Odaberite za koje aktivnosti želite primati obavijesti. Obavijesti
              će vam stići 15 minuta prije početka.
            </Text>

            <View style={styles.notificationList}>
              {notificationCategories.map(category => (
                <View
                  key={category.key}
                  style={styles.notificationItem}>
                  <View style={styles.notificationItemContent}>
                    <View style={styles.notificationItemLeft}>
                      <LinearGradient
                        colors={[category.gradientFrom, category.gradientTo]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notificationItemIcon}>
                        {React.cloneElement(
                          category.icon as React.ReactElement<{
                            color: string;
                            size: number;
                            strokeWidth: number;
                          }>,
                          {
                            color: "#ffffff",
                            size: 20,
                            strokeWidth: 2.5,
                          }
                        )}
                      </LinearGradient>

                      <View style={styles.notificationItemText}>
                        <Text style={styles.notificationItemTitle}>
                          {category.title}
                        </Text>
                        <Text style={styles.notificationItemDesc}>
                          {category.description}
                        </Text>
                      </View>
                    </View>

                    <Switch
                      value={notificationSettings[category.key]}
                      onValueChange={() =>
                        toggleNotificationSetting(category.key)
                      }
                      trackColor={{ false: "#E2E8F0", true: "#0A4977" }}
                      thumbColor={
                        notificationSettings[category.key]
                          ? "#ffffff"
                          : "#ffffff"
                      }
                      ios_backgroundColor="#E2E8F0"
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNotificationSettings}
              activeOpacity={0.8}>
              <LinearGradient
                colors={["#0A4977", "#1E5A8A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButtonGradient}>
                <Text style={styles.saveButtonText}>Spremi postavke</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: "0px -10px 25px rgba(10, 73, 119, 0.25)",
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#ffffff",
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
    paddingTop: 16,
  },
  notificationDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  notificationList: {
    gap: 16,
    marginBottom: 32,
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    boxShadow: "0px 2px 8px rgba(10, 73, 119, 0.08)",
    elevation: 4,
  },
  notificationItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  notificationItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  notificationItemText: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  notificationItemDesc: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  saveButton: {
    marginBottom: 16,
  },
  saveButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
});
