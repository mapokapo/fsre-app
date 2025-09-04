import ContactItem from "@/components/partials/ContactItem";
import NewsSection from "@/components/partials/NewsSection";
import NotificationItem from "@/components/partials/NotificationItem";
import NotificationSettingsModal from "@/components/partials/NotificationSettingsModal";
import ProfileModal from "@/components/partials/ProfileModal";
import QuickLinkItem from "@/components/partials/QuickLinkItem";
import StatsSection from "@/components/partials/StatsSection";
import {
  Section,
  SectionButton,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { quickLinks } from "@/lib/const/quickLinks";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useNotificationsStore } from "@/lib/state/notificationsStore";
import { THEME } from "@/lib/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import {
  Bell,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  UserIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { notifications } = useNotificationsStore();
  const { t } = useTranslation();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  const navigation = useNavigation();
  const { introAnimatedStyle } = useIntroAnimation();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          className="rounded-full bg-white/20 p-6"
          size="icon"
          onPress={() => setShowProfileModal(true)}>
          <Icon
            as={UserIcon}
            className="text-primary-foreground"
            size={24}
          />
        </Button>
      ),
    });
  }, [navigation]);

  const handleLogout = () => {
    setShowProfileModal(false);
    setShowNotificationSettings(false);
    // Navigate to login screen
    router.replace("/login");
  };

  const handleHelp = () => {
    setShowProfileModal(false);
    setShowNotificationSettings(false);
    // Implement help logic here
    console.log("Help pressed");
  };

  const handleNotificationSettings = () => {
    setShowProfileModal(false);
    setShowNotificationSettings(true);
  };

  const handleBackToProfile = () => {
    setShowNotificationSettings(false);
    setShowProfileModal(true);
  };

  return (
    <View className="flex-1 bg-background">
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ProfileModal
            isVisible={showProfileModal && !showNotificationSettings}
            onClose={() => setShowProfileModal(false)}
            onItemPress={item => {
              if (item === "logout") {
                handleLogout();
              } else if (item === "help") {
                handleHelp();
              } else if (item === "notificationSettings") {
                handleNotificationSettings();
              }
            }}
          />

          <NotificationSettingsModal
            isVisible={showNotificationSettings}
            onClose={handleBackToProfile}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Stats */}
            <Section>
              <SectionContent>
                <StatsSection introAnimatedStyle={introAnimatedStyle} />
              </SectionContent>
            </Section>

            {/* Notifications */}
            <Section>
              <SectionHeader style={introAnimatedStyle}>
                <SectionTitle
                  icon={
                    <Icon
                      as={Bell}
                      color={THEME[colorScheme].fsreGradient3}
                      size={24}
                      strokeWidth={2.5}
                    />
                  }
                  title={t("home.notifications.title")}
                />
                <SectionButton title={t("common.all")} />
              </SectionHeader>
              <SectionContent>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    style={introAnimatedStyle}
                  />
                ))}
              </SectionContent>
            </Section>

            {/* News */}
            <Section>
              <SectionHeader>
                <SectionTitle
                  icon={
                    <Icon
                      as={Newspaper}
                      color={THEME[colorScheme].fsreGradient3}
                      size={24}
                      strokeWidth={2.5}
                    />
                  }
                  title={t("home.news.title")}
                />
                <SectionButton title={t("common.all")} />
              </SectionHeader>
              <SectionContent>
                <NewsSection />
              </SectionContent>
            </Section>

            {/* Quick links */}
            <Section>
              <SectionHeader>
                <SectionTitle title={t("home.quickAccess.title")} />
              </SectionHeader>
              <SectionContent>
                <View className="flex-row flex-wrap justify-between gap-4 web:grid web:grid-cols-2">
                  {quickLinks.map(link => (
                    <QuickLinkItem
                      key={link.label(t)}
                      link={link}
                    />
                  ))}
                </View>
              </SectionContent>
            </Section>

            {/* Contact */}
            <Section>
              <SectionHeader>
                <SectionTitle title={t("home.contact.title")} />
              </SectionHeader>
              <SectionContent>
                <View className="overflow-hidden rounded-3xl shadow-md">
                  <LinearGradient
                    className="gap-2 p-4"
                    colors={[
                      THEME[colorScheme].cardGradient1,
                      THEME[colorScheme].cardGradient2,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <ContactItem
                      icon={
                        <Icon
                          as={MapPin}
                          color={THEME[colorScheme].fsreGradient3}
                          size={20}
                          strokeWidth={2.5}
                        />
                      }
                      title={t("home.contact.address")}
                    />
                    <ContactItem
                      icon={
                        <Icon
                          as={Phone}
                          color={THEME[colorScheme].fsreGradient3}
                          size={20}
                          strokeWidth={2.5}
                        />
                      }
                      title={t("home.contact.phone")}
                    />
                    <ContactItem
                      icon={
                        <Icon
                          as={Mail}
                          color={THEME[colorScheme].fsreGradient3}
                          size={20}
                          strokeWidth={2.5}
                        />
                      }
                      title={t("home.contact.email")}
                    />
                  </LinearGradient>
                </View>
              </SectionContent>
            </Section>
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
}
