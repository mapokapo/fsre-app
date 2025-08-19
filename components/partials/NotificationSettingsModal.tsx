import { notificationTypes } from "@/lib/const/notificationTypes";
import { useNotificationsStore } from "@/lib/state/notificationSettingsStore";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type NotificationSettingsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function NotificationSettingsModal({
  isVisible,
  onClose,
}: NotificationSettingsModalProps) {
  const { notificationSettings, setNotificationSettings } =
    useNotificationsStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const toggleNotificationSetting = (
    type: keyof typeof notificationSettings
  ) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
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
      onDismiss={onClose}>
      <BottomSheetView>
        <View style={styles.notificationModal}>
          <View style={styles.notificationModalHeader}>
            <Text style={styles.notificationModalTitle}>
              Postavke obavijesti
            </Text>
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
          <ScrollView
            style={styles.notificationContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notificationContentContainer}>
            <Text style={styles.notificationDescription}>
              Odaberite za koje aktivnosti želite primati obavijesti. Obavijesti
              će vam stići 15 minuta prije početka.
            </Text>

            <View style={styles.notificationList}>
              {notificationTypes.map(type => (
                <View
                  key={type.id}
                  style={styles.notificationItem}>
                  <View style={styles.notificationItemContent}>
                    <View style={styles.notificationItemLeft}>
                      <LinearGradient
                        colors={type.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notificationItemIcon}>
                        {React.cloneElement(
                          type.icon as React.ReactElement<{
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
                          {type.title}
                        </Text>
                        <Text style={styles.notificationItemDesc}>
                          {type.description}
                        </Text>
                      </View>
                    </View>

                    <Switch
                      value={
                        notificationSettings[
                          type.id as keyof typeof notificationSettings
                        ]
                      }
                      onValueChange={() => toggleNotificationSetting(type.id)}
                      trackColor={{ false: "#E2E8F0", true: "#0A4977" }}
                      thumbColor={
                        notificationSettings[
                          type.id as keyof typeof notificationSettings
                        ]
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
          </ScrollView>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  notificationModal: {
    backgroundColor: "#f00",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "60%",
    boxShadow: "0px -10px 25px rgba(10, 73, 119, 0.25)",
    elevation: 20,
  },
  notificationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#ffffff",
  },
  notificationModalTitle: {
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
  },
  notificationContentContainer: {
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
