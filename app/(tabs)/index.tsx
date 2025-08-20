import {
  Header,
  HeaderButton,
  HeaderIntro,
  HeaderProfileButton,
  HeaderSubtitle,
  HeaderTitle,
} from "@/components/header";
import {
  Modal,
  ModalActionButton,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/modal";
import NotificationItem from "@/components/NotificationItem";
import NotificationSettingsModal from "@/components/partials/NotificationSettingsModal";
import ProfileView from "@/components/partials/ProfileView";
import { useNotificationsStore } from "@/lib/state/notificationsStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  ExternalLink,
  Globe,
  HelpCircle,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ColorValue,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const news: {
  id: number;
  title: string;
  summary: string;
  image: string;
  time: string;
  category: string;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}[] = [
  {
    id: 1,
    title: "FSRE dobio najnoviju računalnu opremu",
    summary:
      "Fakultet je opremljen najnovijim računalima i serverima za potrebe nastave i istraživanja. Studenti sada imaju pristup najmodernijoj tehnologiji.",
    image:
      "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800",
    time: "3d",
    category: "Tehnologija",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: 2,
    title: "Međunarodni uspjeh studenata",
    summary:
      "Tim studenata FSRE-a osvojio drugo mjesto na prestižnom hackathonu u Beču. Projekt se fokusirao na AI rješenja za održivi razvoj.",
    image:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
    time: "1w",
    category: "Natjecanja",
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    id: 3,
    title: "Nova laboratorijska oprema",
    summary:
      "Fakultet je investirao u najnoviju laboratorijsku opremu za potrebe praktične nastave iz područja strojarstva i elektrotehnike.",
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    time: "2w",
    category: "Laboratoriji",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: 4,
    title: "Stipendije za izvrsne studente",
    summary:
      "Objavljene su nove stipendije za studente s izvrsnim akademskim rezultatima. Prijave su otvorene do kraja mjeseca.",
    image:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    time: "5d",
    category: "Stipendije",
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    id: 5,
    title: "Gostujuće predavanje o AI",
    summary:
      "Poznati stručnjak iz područja umjetne inteligencije održat će predavanje o budućnosti tehnologije i njezinoj primjeni.",
    image:
      "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
    time: "1d",
    category: "Predavanja",
    gradient: ["#fa709a", "#fee140"],
  },
];

// VRAĆAM ORIGINALNE BRZE PRISTUPE!
const quickLinks: ({
  name: string;
  icon: LucideIcon;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
} & (
  | {
      action: "navigate";
    }
  | {
      url: string;
    }
))[] = [
  {
    name: "Studomat",
    icon: ExternalLink,
    gradient: ["#667eea", "#764ba2"],
    url: "https://studomat.sum.ba",
  },
  {
    name: "eLearning",
    icon: Globe,
    gradient: ["#f093fb", "#f5576c"],
    url: "https://elearning.sum.ba",
  },
  {
    name: "Webmail",
    icon: Mail,
    gradient: ["#4facfe", "#00f2fe"],
    url: "https://webmail.sum.ba",
  },
  {
    name: "Raspored",
    icon: Calendar,
    gradient: ["#43e97b", "#38f9d7"],
    action: "navigate",
  },
];

const stats = [
  {
    label: "Aktivnih\nstudenata",
    value: "1,247",
    icon: Users,
    color: "#4ECDC4",
  },
  { label: "Završenih\nprojekata", value: "89", icon: Award, color: "#FF6B6B" },
  { label: "Uspješnost", value: "94%", icon: TrendingUp, color: "#45B7D1" },
];

export default function HomeScreen() {
  const { notifications } = useNotificationsStore();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

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

  // Handle quick link press
  const handleQuickLinkPress = async (link: (typeof quickLinks)[0]) => {
    if ("action" in link && link.action === "navigate") {
      // Navigate to schedule tab
      router.push("/(tabs)/schedule");
    } else if ("url" in link) {
      // Open external URL
      try {
        const supported = await Linking.canOpenURL(link.url);
        if (supported) {
          await Linking.openURL(link.url);
        } else {
          console.log("Don't know how to open URI: " + link.url);
        }
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <SafeAreaView style={styles.container}>
            <Header
              isMain
              animatedStyle={animatedStyle}>
              <HeaderIntro>Dobrodošli na</HeaderIntro>
              <HeaderTitle>FSRE</HeaderTitle>
              <HeaderSubtitle>
                Fakultet strojarstva, računarstva i elektrotehnike
              </HeaderSubtitle>
              <HeaderButton onPress={() => setShowProfileModal(true)}>
                <HeaderProfileButton />
              </HeaderButton>
            </Header>

            {/* Profile Modal */}
            <Modal
              isVisible={showProfileModal && !showNotificationSettings}
              onClose={() => setShowProfileModal(false)}>
              <ModalHeader>
                <ModalTitle>Profil</ModalTitle>
                <ModalCloseButton onClose={() => setShowProfileModal(false)} />
              </ModalHeader>
              <ModalContent>
                <ProfileView />
              </ModalContent>
              <ModalFooter>
                <ModalActionButton
                  onPress={handleNotificationSettings}
                  icon={
                    <Bell
                      color="#0A4977"
                      size={20}
                      strokeWidth={2.5}
                    />
                  }
                  text="Postavke obavijesti"
                />
                <ModalActionButton
                  onPress={handleHelp}
                  icon={
                    <HelpCircle
                      color="#0A4977"
                      size={20}
                      strokeWidth={2.5}
                    />
                  }
                  text="Pomoć"
                />
                <ModalActionButton
                  onPress={handleLogout}
                  style={{
                    borderColor: "#FEE2E2",
                    backgroundColor: "#FEFEFE",
                  }}
                  icon={
                    <LogOut
                      color="#DC2626"
                      size={20}
                      strokeWidth={2.5}
                      style={{
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                      }}
                    />
                  }
                  text="Odjavi se"
                  textStyle={{
                    color: "#DC2626",
                  }}
                />
              </ModalFooter>
            </Modal>

            <NotificationSettingsModal
              isVisible={showNotificationSettings}
              onClose={handleBackToProfile}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.statsSection}>
                <Animated.View style={[styles.statsContainer, animatedStyle]}>
                  {stats.map((stat, index) => (
                    <View
                      key={index}
                      style={styles.statCard}>
                      <View
                        style={[
                          styles.statIcon,
                          { backgroundColor: `${stat.color}20` },
                        ]}>
                        <stat.icon
                          color={stat.color}
                          size={22}
                          strokeWidth={2.5}
                        />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </Animated.View>
              </View>

              {/* Notifications */}
              <Animated.View
                style={[
                  styles.section,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Bell
                      color="#0A4977"
                      size={24}
                      strokeWidth={2.5}
                    />
                    <Text style={styles.sectionTitle}>Obavijesti</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    activeOpacity={0.8}>
                    <Text style={styles.seeAllText}>Sve</Text>
                    <ChevronRight
                      color="#0A4977"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </TouchableOpacity>
                </View>

                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </Animated.View>

              {/* News */}
              <Animated.View
                style={[
                  styles.section,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleContainer}>
                    <Newspaper
                      color="#0A4977"
                      size={24}
                      strokeWidth={2.5}
                    />
                    <Text style={styles.sectionTitle}>Novosti</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAllButton}
                    activeOpacity={0.8}>
                    <Text style={styles.seeAllText}>Sve</Text>
                    <ChevronRight
                      color="#0A4977"
                      size={18}
                      strokeWidth={2.5}
                    />
                  </TouchableOpacity>
                </View>

                {news.map(article => (
                  <TouchableOpacity
                    key={article.id}
                    style={styles.newsCard}
                    activeOpacity={0.8}>
                    <View style={styles.newsImageContainer}>
                      <Image
                        source={{ uri: article.image }}
                        style={styles.newsImage}
                      />
                      <LinearGradient
                        colors={article.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.newsCategoryBadge}>
                        <Text style={styles.newsCategoryText}>
                          {article.category}
                        </Text>
                      </LinearGradient>
                    </View>
                    <View style={styles.newsContent}>
                      <Text style={styles.newsTitle}>{article.title}</Text>
                      <Text style={styles.newsSummary}>{article.summary}</Text>
                      <Text style={styles.newsTime}>prije {article.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </Animated.View>

              {/* Quick Links - VRAĆENI SU! */}
              <Animated.View
                style={[
                  styles.section,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Brzi pristup</Text>
                </View>
                <View style={styles.linksGrid}>
                  {quickLinks.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.linkCard}
                      activeOpacity={0.8}
                      onPress={() => handleQuickLinkPress(link)}>
                      <LinearGradient
                        colors={link.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.linkIconContainer}>
                        <link.icon
                          color="#ffffff"
                          size={26}
                          strokeWidth={2.5}
                        />
                      </LinearGradient>
                      <Text style={styles.linkText}>{link.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>

              {/* Contact */}
              <Animated.View
                style={[
                  styles.section,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Kontakt</Text>
                </View>
                <View style={styles.contactCard}>
                  <LinearGradient
                    colors={[
                      "rgba(10, 73, 119, 0.05)",
                      "rgba(59, 130, 246, 0.05)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.contactGradient}>
                    <TouchableOpacity
                      style={styles.contactRow}
                      activeOpacity={0.8}>
                      <View style={styles.contactIcon}>
                        <MapPin
                          color="#0A4977"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </View>
                      <Text style={styles.contactText}>
                        Matice hrvatske bb, 88000 Mostar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactRow}
                      activeOpacity={0.8}>
                      <View style={styles.contactIcon}>
                        <Phone
                          color="#0A4977"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </View>
                      <Text style={styles.contactText}>+387 36 355 025</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactRow}
                      activeOpacity={0.8}>
                      <View style={styles.contactIcon}>
                        <Mail
                          color="#0A4977"
                          size={20}
                          strokeWidth={2.5}
                        />
                      </View>
                      <Text style={styles.contactText}>info@fsre.sum.ba</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </Animated.View>
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
    paddingBottom: 30, // Smanjeno sa 40 na 30
    paddingHorizontal: 26,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    boxShadow: "0px 6px 15px rgba(10, 73, 119, 0.1)",
    elevation: 8,
    minHeight: 120,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter-Medium",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 14,
  },
  section: {
    paddingHorizontal: 26,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginLeft: 12,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    borderRadius: 18,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: "#0A4977",
    marginRight: 5,
  },
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    marginBottom: 22,
    overflow: "hidden",
    boxShadow: "0px 8px 20px rgba(10, 73, 119, 0.12)",
    elevation: 10,
  },
  newsImageContainer: {
    position: "relative",
  },
  newsImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  newsCategoryBadge: {
    position: "absolute",
    top: 18,
    left: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  newsCategoryText: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  newsContent: {
    padding: 22,
  },
  newsTitle: {
    fontSize: 19,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 10,
    lineHeight: 26,
  },
  newsSummary: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 14,
  },
  newsTime: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#94A3B8",
  },
  linksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  linkCard: {
    width: (width - 70) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    boxShadow: "0px 6px 15px rgba(10, 73, 119, 0.1)",
    elevation: 8,
  },
  linkIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  linkText: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    textAlign: "center",
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
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  contactText: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#1A1A1A",
    flex: 1,
  },
});
