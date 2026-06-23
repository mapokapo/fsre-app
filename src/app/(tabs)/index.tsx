import ContactItem from "@/components/partials/ContactItem";
import CreditsModal from "@/components/partials/CreditsModal";
import NewsSection from "@/components/partials/NewsSection";
import QuickLinkItem from "@/components/partials/QuickLinkItem";
import SettingsModal from "@/components/partials/SettingsModal";
import SettingsHeaderButton from "@/components/partials/SettingsHeaderButton";
import {
  Section,
  SectionButton,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from "@/components/section";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { quickLinks } from "@/lib/const/quickLinks";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { useNavigationHeaderRight } from "@/lib/hooks/useNavigationHeaderRight";
import { THEME } from "@/lib/theme";
import { chunkArray } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { Mail, MapPin, Newspaper, Phone } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, RefreshControl, ScrollView, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const handleOpenSettings = useCallback(() => {
    setShowSettingsModal(true);
  }, []);

  useNavigationHeaderRight(navigation, SettingsHeaderButton, {
    onPress: handleOpenSettings,
  });

  const handleOpenHelp = () => {
    setShowSettingsModal(false);
    router.push("/chatbot");
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
      <SettingsModal
        isVisible={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
        }}
        onItemPress={item => {
          switch (item) {
            case "help":
              handleOpenHelp();
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
                  key={chunk.map(link => link.label(t)).join("-")}
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
                  title={t("home.contact.address")}
                  action={{
                    type: "address",
                    value: t("home.contact.address"),
                  }}
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
                  title={t("home.contact.generalPhone")}
                  action={{
                    type: "phone",
                    value: t("home.contact.generalPhone").replace(/[\s-]/g, ""),
                  }}
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
                  title={t("home.contact.generalEmail")}
                  action={{
                    type: "email",
                    value: t("home.contact.generalEmail"),
                  }}
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
                  title={t("home.contact.studentPhone")}
                  action={{
                    type: "phone",
                    value: t("home.contact.studentPhone").replace(/[\s-]/g, ""),
                  }}
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
                  title={t("home.contact.studentEmail")}
                  action={{
                    type: "email",
                    value: t("home.contact.studentEmail"),
                  }}
                />
              </LinearGradient>
            </View>
          </SectionContent>
        </Section>
      </ScrollView>
    </View>
  );
}
