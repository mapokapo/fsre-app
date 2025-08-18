import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  Globe,
  CircleHelp as HelpCircle,
  LogOut,
  LucideIcon,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  ColorValue,
  Dimensions,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const notifications: {
  id: number;
  title: string;
  message: string;
  time: string;
  urgent: boolean;
  icon: LucideIcon;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}[] = [
  {
    id: 1,
    title: "Prijava za ispitni rok",
    message: "Prijava za zimski ispitni rok otvorena do 15. siječnja",
    time: "2h",
    urgent: true,
    icon: Calendar,
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    id: 2,
    title: "AI & Machine Learning radionica",
    message: "Besplatna radionica za studente u laboratoriju L-3",
    time: "1d",
    urgent: false,
    icon: Zap,
    gradient: ["#4ECDC4", "#44A08D"],
  },
  {
    id: 3,
    title: "Novi laboratorijski termini",
    message: "Dodani su novi termini za laboratorijske vježbe",
    time: "3d",
    urgent: false,
    icon: Users,
    gradient: ["#A8E6CF", "#7FCDCD"],
  },
];

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

// Mock student data
const studentData = {
  name: "Marko Petrović",
  indexNumber: "R-2021/0123",
  year: "3. godina",
  department: "Računarstvo",
  email: "marko.petrovic@student.sum.ba",
};

// Notification settings
const notificationTypes: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}[] = [
  {
    id: "lectures",
    title: "Predavanja",
    description: "Obavijesti prije početka predavanja",
    icon: BookOpen,
    gradient: ["#0A4977", "#1E5A8A"],
  },
  {
    id: "exercises",
    title: "Vježbe",
    description: "Obavijesti prije početka vježbi",
    icon: Users,
    gradient: ["#059669", "#10B981"],
  },
  {
    id: "labs",
    title: "Laboratoriji",
    description: "Obavijesti prije laboratorijskih vježbi",
    icon: FlaskConical,
    gradient: ["#DC2626", "#EF4444"],
  },
  {
    id: "exams",
    title: "Ispiti",
    description: "Obavijesti o ispitnim rokovima",
    icon: Calendar,
    gradient: ["#7C3AED", "#A855F7"],
  },
  {
    id: "news",
    title: "Novosti",
    description: "Obavijesti o novostima fakulteta",
    icon: Newspaper,
    gradient: ["#EA580C", "#F97316"],
  },
];

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] =
    useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    lectures: true,
    exercises: true,
    labs: false,
    exams: true,
    news: false,
  });

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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

  const toggleNotificationSetting = (type: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const handleBackToProfile = () => {
    setShowNotificationSettings(false);
    setShowProfileModal(true);
  };

  const handleCloseAllModals = () => {
    setShowNotificationSettings(false);
    setShowProfileModal(false);
  };

  const handleSaveNotificationSettings = () => {
    // Here you would typically save to AsyncStorage or API
    console.log("Saving notification settings:", notificationSettings);
    setShowNotificationSettings(false);
    setShowProfileModal(false);
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
    <SafeAreaView style={styles.container}>
      {/* Static Header - No animation */}
      <View style={styles.staticHeaderContainer}>
        <LinearGradient
          colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.staticHeader}>
          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroGreeting}>Dobrodošli na</Text>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>FSRE</Text>
              </View>
              <Text style={styles.heroSubtitle}>
                Fakultet strojarstva, računarstva i elektrotehnike
              </Text>
            </View>

            {/* Profile Section */}
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setShowProfileModal(true)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(255, 255, 255, 0.1)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileButtonGradient}>
                <User
                  color="#ffffff"
                  size={22}
                  strokeWidth={2.5}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal && !showNotificationSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAllModals}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseAllModals}
          />
          <View style={styles.profileModal}>
            <LinearGradient
              colors={["#ffffff", "#f8fafc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.profileModalGradient}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Profil</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseAllModals}
                  activeOpacity={0.8}>
                  <X
                    color="#64748B"
                    size={20}
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
              </View>

              {/* Student Info */}
              <View style={styles.studentInfo}>
                <View style={styles.studentAvatar}>
                  <LinearGradient
                    colors={["#0A4977", "#1E5A8A"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.studentAvatarGradient}>
                    <User
                      color="#ffffff"
                      size={32}
                      strokeWidth={2.5}
                    />
                  </LinearGradient>
                </View>

                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{studentData.name}</Text>
                  <Text style={styles.studentIndex}>
                    Broj indeksa: {studentData.indexNumber}
                  </Text>
                  <View style={styles.studentMeta}>
                    <Text style={styles.studentYear}>{studentData.year}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.studentDepartment}>
                      {studentData.department}
                    </Text>
                  </View>
                  <Text style={styles.studentEmail}>{studentData.email}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleNotificationSettings}
                  activeOpacity={0.8}>
                  <View style={styles.actionButtonContent}>
                    <View style={styles.actionIcon}>
                      <Bell
                        color="#0A4977"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={styles.actionButtonText}>
                      Postavke obavijesti
                    </Text>
                    <ChevronRight
                      color="#94A3B8"
                      size={16}
                      strokeWidth={2.5}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleHelp}
                  activeOpacity={0.8}>
                  <View style={styles.actionButtonContent}>
                    <View style={styles.actionIcon}>
                      <HelpCircle
                        color="#0A4977"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={styles.actionButtonText}>Pomoć</Text>
                    <ChevronRight
                      color="#94A3B8"
                      size={16}
                      strokeWidth={2.5}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.logoutButton]}
                  onPress={handleLogout}
                  activeOpacity={0.8}>
                  <View style={styles.actionButtonContent}>
                    <View style={[styles.actionIcon, styles.logoutIcon]}>
                      <LogOut
                        color="#DC2626"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={[styles.actionButtonText, styles.logoutText]}>
                      Odjavi se
                    </Text>
                    <ChevronRight
                      color="#94A3B8"
                      size={16}
                      strokeWidth={2.5}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Notification Settings Modal - COMPLETELY FIXED */}
      <Modal
        visible={showNotificationSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={handleBackToProfile}>
        <View style={styles.notificationModalOverlay}>
          <TouchableOpacity
            style={styles.notificationModalBackdrop}
            activeOpacity={1}
            onPress={handleBackToProfile}
          />
          <View style={styles.notificationModal}>
            {/* Modal Header - Fixed */}
            <View style={styles.notificationModalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToProfile}
                activeOpacity={0.8}>
                <ChevronRight
                  color="#0A4977"
                  size={20}
                  strokeWidth={2.5}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </TouchableOpacity>
              <Text style={styles.notificationModalTitle}>
                Postavke obavijesti
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseAllModals}
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
                Odaberite za koje aktivnosti želite primati obavijesti.
                Obavijesti će vam stići 15 minuta prije početka.
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
                          <type.icon
                            color="#ffffff"
                            size={20}
                            strokeWidth={2.5}
                          />
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
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Spacer for static header */}
        <View style={styles.headerSpacer} />

        {/* Stats Cards - Now scrollable with proper spacing */}
        <View style={styles.statsSection}>
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            {stats.map((stat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.statCard}
                activeOpacity={0.8}>
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
              </TouchableOpacity>
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
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationCard}
              activeOpacity={0.8}>
              <LinearGradient
                colors={notification.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.notificationGradient}>
                <notification.icon
                  color="#ffffff"
                  size={22}
                  strokeWidth={2.5}
                />
              </LinearGradient>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <View style={styles.notificationMeta}>
                    {notification.urgent && <View style={styles.urgentDot} />}
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
              </View>
            </TouchableOpacity>
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
            styles.lastSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          <View style={styles.contactCard}>
            <LinearGradient
              colors={["rgba(10, 73, 119, 0.05)", "rgba(59, 130, 246, 0.05)"]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Static header - no animation, stays in place
  staticHeaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  staticHeader: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 26,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerSpacer: {
    height: 180, // Visina headera
  },
  scrollContent: {
    paddingBottom: 130,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTextContainer: {
    flex: 1,
  },
  heroGreeting: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Inter-Medium",
    marginBottom: 12,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoText: {
    fontSize: 48,
    fontFamily: "Inter-ExtraBold",
    color: "#ffffff",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    maxWidth: "90%",
  },
  // Profile Button Styles
  profileButton: {
    marginLeft: 16,
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    elevation: 6,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileModal: {
    width: width - 48,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0px 20px 25px rgba(10, 73, 119, 0.25)",
    elevation: 20,
  },
  profileModalGradient: {
    padding: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  studentInfo: {
    padding: 24,
    alignItems: "center",
  },
  studentAvatar: {
    marginBottom: 16,
  },
  studentAvatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  studentDetails: {
    alignItems: "center",
  },
  studentName: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  studentIndex: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#0A4977",
    marginBottom: 8,
  },
  studentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  studentYear: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  studentDepartment: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  studentEmail: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#94A3B8",
  },
  actionButtons: {
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  logoutButton: {
    borderColor: "#FEE2E2",
    backgroundColor: "#FEFEFE",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(10, 73, 119, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoutIcon: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
  },
  logoutText: {
    color: "#DC2626",
  },
  // Notification Settings Modal - COMPLETELY FIXED STYLES
  notificationModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  notificationModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notificationModal: {
    backgroundColor: "#ffffff",
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
  // Smanjeni spacing za statistike sekciju
  statsSection: {
    paddingTop: 60,
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
  lastSection: {
    marginBottom: 0,
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
