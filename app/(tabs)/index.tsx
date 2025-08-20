import { HeaderButton, HeaderProfileButton } from "@/components/header";
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
import MockData from "@/lib/const/mockData";
import { quickLinks } from "@/lib/const/quickLinks";
import { useNotificationsStore } from "@/lib/state/notificationsStore";
import { useStatsStore } from "@/lib/state/statsStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { Bell, Mail, MapPin, Newspaper, Phone } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { notifications } = useNotificationsStore();
  const { stats } = useStatsStore();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  const navigation = useNavigation();

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(fadeAnim.value, { duration: 1000 }),
      transform: [
        { translateY: withTiming(slideAnim.value, { duration: 1000 }) },
      ],
    }),
    [fadeAnim, slideAnim]
  );

  const startAnimation = useCallback(() => {
    fadeAnim.value = 1;
    slideAnim.value = 0;
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={() => setShowProfileModal(true)}>
          <HeaderProfileButton />
        </HeaderButton>
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
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <SafeAreaView style={styles.container}>
            {/* Profile Modal */}
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
              <View style={styles.statsSection}>
                <Animated.View style={[styles.statsContainer, animatedStyle]}>
                  {stats.map(stat => (
                    <StatsCard
                      key={stat.key}
                      stat={stat}
                    />
                  ))}
                </Animated.View>
              </View>

              {/* Notifications */}
              <Section>
                <SectionHeader>
                  <SectionTitle
                    icon={
                      <Bell
                        color="#0A4977"
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
                    />
                  ))}
                </SectionContent>
              </Section>

              {/* News */}
              <Section>
                <SectionHeader>
                  <SectionTitle
                    icon={
                      <Newspaper
                        color="#0A4977"
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

              {/* Quick Links - VRAĆENI SU! */}
              <Section>
                <SectionHeader>
                  <SectionTitle title="Brzi pristup" />
                </SectionHeader>
                <SectionContent>
                  <View style={styles.linksGrid}>
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
                  <View style={styles.contactCard}>
                    <LinearGradient
                      colors={[
                        "rgba(10, 73, 119, 0.05)",
                        "rgba(59, 130, 246, 0.05)",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.contactGradient}>
                      <ContactItem
                        icon={
                          <MapPin
                            color="#0A4977"
                            size={20}
                            strokeWidth={2.5}
                          />
                        }
                        title="Matice hrvatske bb, 88000 Mostar"
                      />
                      <ContactItem
                        icon={
                          <Phone
                            color="#0A4977"
                            size={20}
                            strokeWidth={2.5}
                          />
                        }
                        title="+387 36 355 025"
                      />
                      <ContactItem
                        icon={
                          <Mail
                            color="#0A4977"
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
          </SafeAreaView>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  statsSection: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 26,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 14,
  },
  linksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  contactCard: {
    borderRadius: 26,
    overflow: "hidden",
    boxShadow: "0px 6px 15px rgba(10, 73, 119, 0.1)",
    elevation: 8,
  },
  contactGradient: {
    padding: 26,
    backgroundColor: "#ffffff",
  },
});
