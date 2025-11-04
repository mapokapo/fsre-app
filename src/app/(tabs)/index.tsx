import ContactItem from "@/components/partials/ContactItem";
import NewsSection from "@/components/partials/NewsSection";
import NotificationSettingsModal from "@/components/partials/NotificationSettingsModal";
import QuickLinkItem from "@/components/partials/QuickLinkItem";
import SettingsModal from "@/components/partials/SettingsModal";
import {
  Section,
  SectionButton,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { quickLinks } from "@/lib/const/quickLinks";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { useAuth } from "@/lib/state/authStore";
import { THEME } from "@/lib/theme";
import { chunkArray } from "@/lib/utils";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import {
  Mail,
  MapPin,
  Newspaper,
  Phone,
  SettingsIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, RefreshControl, ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const { setSession } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          className="rounded-full bg-white/20 p-6"
          size="icon"
          onPress={() => setShowProfileModal(true)}>
          <Icon
            as={SettingsIcon}
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
    setSession(null);
  };

  const handleHelp = () => {
    setShowProfileModal(false);
    setShowNotificationSettings(false);
    // TODO: implement help action
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

  const onRefresh = async () => {
    setIsRefreshing(true);

    await queryClient.invalidateQueries({ queryKey: ["newsArticles"] });

    setIsRefreshing(false);
  };

  return (
    <View className="flex-1 bg-background">
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <SettingsModal
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }>
            {/* Stats */}
            {/*
            <Section>
              <SectionContent>
                <StatsSection introAnimatedStyle={introAnimatedStyle} />
              </SectionContent>
            </Section>
            */}

            {/* Notifications */}
            {/*
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
            */}

            {/* News */}
            <Section className="mt-8">
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
                <SectionButton
                  title={t("common.all")}
                  onPress={() => {
                    Linking.openURL("https://fsre.sum.ba/novosti/");
                  }}
                />
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
                <View className="gap-4">
                  {chunkArray(quickLinks, 2).map(chunk => (
                    <View
                      key={`${chunk[0]!.label(t)}-${chunk[1]!.label(t)}`}
                      className="flex-row flex-wrap justify-between gap-4">
                      {chunk.map(link => (
                        <QuickLinkItem
                          key={link.label(t)}
                          link={link}
                        />
                      ))}
                    </View>
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
                    <Text className="ml-3 text-sm text-card-gradient-foreground/85">
                      Za opće upite:
                    </Text>
                    <ContactItem
                      icon={
                        <Icon
                          as={MapPin}
                          color={THEME[colorScheme].fsreGradient3}
                          size={20}
                          strokeWidth={2.5}
                        />
                      }
                      title="Matice hrvatske bb, 88000, Mostar"
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
                      title="+387 36 337-001"
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
                      title="fsre@sum.ba"
                    />
                    <Text className="ml-3 text-sm text-card-gradient-foreground/85">
                      Za studentska pitanja:
                    </Text>
                    <ContactItem
                      icon={
                        <Icon
                          as={Phone}
                          color={THEME[colorScheme].fsreGradient3}
                          size={20}
                          strokeWidth={2.5}
                        />
                      }
                      title="+387 36 337-003"
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
                      title={"referada@fsre.sum.ba"}
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
