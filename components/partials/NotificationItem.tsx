import Notification from "@/lib/types/Notification";
import { getDistanceTo } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar,
  Info,
  LucideProps,
  UserIcon,
  Zap,
} from "lucide-react-native";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type NotificationItemProps = {
  notification: Notification;
};

const iconProps: LucideProps = {
  color: "#ffffff",
  size: 22,
  strokeWidth: 2.5,
};

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const getIcon = useCallback(
    (iconCode: typeof notification.iconCode) => {
      switch (iconCode) {
        case "timetable":
          return <Calendar {...iconProps} />;
        case "tech-news":
          return <Zap {...iconProps} />;
        case "student":
          return <UserIcon {...iconProps} />;
        default:
          return <Info {...iconProps} />;
      }
    },
    [notification]
  );

  return (
    <TouchableOpacity
      key={notification.id}
      style={styles.notificationCard}
      activeOpacity={0.8}>
      <LinearGradient
        colors={[notification.gradientFrom, notification.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.notificationGradient}>
        {getIcon(notification.iconCode)}
      </LinearGradient>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <View style={styles.notificationMeta}>
            {notification.urgent && <View style={styles.urgentDot} />}
            <Text style={styles.notificationTime}>
              {getDistanceTo(notification.datetime)}
            </Text>
          </View>
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationContent: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  notificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    boxShadow: "0px 6px 15px rgba(10, 73, 119, 0.1)",
    elevation: 8,
  },
  notificationGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 14,
  },
  notificationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  urgentDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#FF6B6B",
    marginRight: 7,
  },
  notificationTime: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  notificationMessage: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 22,
  },
});
