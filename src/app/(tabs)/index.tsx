import ContactItem from "@/components/partials/ContactItem";
import NewsArticleItem from "@/components/partials/NewsArticleItem";
import NotificationItem from "@/components/partials/NotificationItem";
import NotificationSettingsModal from "@/components/partials/NotificationSettingsModal";
import ProfileModal from "@/components/partials/ProfileModal";
import QuickLinkItem from "@/components/partials/QuickLinkItem";
import StatsCard from "@/components/partials/StatsCard";
import {
  Section,
  SectionButton,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import MockData from "@/lib/const/mockData";
import { quickLinks } from "@/lib/const/quickLinks";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useNotificationsStore } from "@/lib/state/notificationsStore";
import { useStatsStore } from "@/lib/state/statsStore";
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
import { ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { notifications } = useNotificationsStore();
  const { stats } = useStatsStore();

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
  });

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
                <View className="mt-8 flex-row gap-4">
                  {stats.map(stat => (
                    <StatsCard
                      key={stat.key}
                      stat={stat}
                      style={introAnimatedStyle}
                    />
                  ))}
                </View>
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
                  title="Obavijesti"
                />
                <SectionButton title="Sve" />
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
                  title="Novosti"
                />
                <SectionButton title="Sve" />
              </SectionHeader>
              <SectionContent>
                {MockData.getNewsArticles().map(article => (
                  <NewsArticleItem
                    key={article.id}
                    article={article}
                  />
                ))}
              </SectionContent>
            </Section>

            {/* Quick links */}
            <Section>
              <SectionHeader>
                <SectionTitle title="Brzi pristup" />
              </SectionHeader>
              <SectionContent>
                <View className="flex-row flex-wrap justify-between gap-4">
                  {quickLinks.map(link => (
                    <QuickLinkItem
                      key={link.label}
                      link={link}
                    />
                  ))}
                </View>
              </SectionContent>
            </Section>

            {/* Contact */}
            <Section>
              <SectionHeader>
                <SectionTitle title="Kontakt" />
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
                      title="Matice hrvatske bb, 88000 Mostar"
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
                      title="+387 36 355 025"
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
                      title="info@fsre.sum.ba"
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
