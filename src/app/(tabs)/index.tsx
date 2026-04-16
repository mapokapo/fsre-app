import ContactItem from "@/components/partials/ContactItem";
import CreditsModal from "@/components/partials/CreditsModal";
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          className="rounded-full bg-white/20 p-6"
          size="icon"
          onPress={() => setShowSettingsModal(true)}>
          <Icon
            as={SettingsIcon}
            className="text-primary-foreground"
            size={24}
          />
        </Button>
      ),
    });
  }, [navigation]);

  const handleOpenHelp = () => {
    setShowSettingsModal(false);
    setShowNotificationSettings(false);
    // TODO: implement help action
    console.log("Help pressed");
  };

  const handleOpenNotificationSettingsModal = () => {
    setShowSettingsModal(false);
    setShowNotificationSettings(true);
  };

  const handleCloseNotificationSettingsModal = () => {
    setShowNotificationSettings(false);
    setShowSettingsModal(true);
  };

  const handleOpenCredits = () => {
    setShowCredits(true);
  };

  const handleCloseCredits = () => {
    setShowCredits(false);
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
            isVisible={showSettingsModal && !showNotificationSettings}
            onClose={() => {
              setShowSettingsModal(false);
              setShowNotificationSettings(false);
            }}
            onItemPress={item => {
              switch (item) {
                case "help":
                  handleOpenHelp();
                  break;
                case "notificationSettings":
                  handleOpenNotificationSettingsModal();
                  break;
                case "credits":
                  handleOpenCredits();
                  break;
              }
            }}
          />
          <CreditsModal
            isVisible={showCredits}
            onClose={handleCloseCredits}
          />

          <NotificationSettingsModal
            isVisible={showNotificationSettings}
            onClose={handleCloseNotificationSettingsModal}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }>
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
                      {t("home.contact.generalInquiries")}:
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
                      {t("home.contact.studentInquiries")}:
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
