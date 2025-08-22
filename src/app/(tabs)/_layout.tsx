import Dots from "@/components/Dots";
import {
  HeaderIcon,
  HeaderIntro,
  HeaderSubtitle,
  HeaderTitle,
} from "@/components/header";
import HeaderBackground from "@/components/header/HeaderBackground";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { PlatformPressable } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname } from "expo-router";
import { Calendar, Home, Sparkles } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const routePathNameToHeaderData: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    isMain: boolean;
  }
> = {
  "/": {
    title: "FSRE",
    subtitle: "Fakultet strojarstva, računarstva i elektrotehnike",
    icon: null,
    isMain: true,
  },
  "/chatbot": {
    title: "FSRE AI Asistent",
    subtitle: "Uvijek tu da pomognem",
    icon: (
      <Sparkles
        color="#ffffff"
        size={24}
        strokeWidth={2.5}
      />
    ),
    isMain: false,
  },
  "/schedule": {
    title: "Raspored",
    subtitle: "Predavanja i vježbe",
    icon: (
      <Calendar
        color="#ffffff"
        size={24}
        strokeWidth={2.5}
      />
    ),
    isMain: false,
  },
};

export default function TabLayout() {
  const pathname = usePathname();
  const headerData = routePathNameToHeaderData[pathname];
  const { introAnimatedStyle } = useIntroAnimation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            height: headerData.isMain ? 200 : 120,
          },
          headerBackground: () => <HeaderBackground />,
          headerTitleContainerStyle: {
            paddingTop: 24,
            paddingBottom: 24,
          },
          headerTitle: () => (
            <Animated.View style={introAnimatedStyle}>
              {headerData.isMain && <HeaderIntro>Dobrodošli na</HeaderIntro>}
              <HeaderTitle isIntro={headerData.isMain}>
                {headerData.title}
              </HeaderTitle>
              <HeaderSubtitle isIntro={headerData.isMain}>
                {headerData.subtitle}
              </HeaderSubtitle>
            </Animated.View>
          ),
          headerLeftContainerStyle: {
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: headerData.isMain ? 8 : 24,
          },
          headerLeft: () =>
            headerData.icon && (
              <Animated.View style={introAnimatedStyle}>
                <HeaderIcon>{headerData.icon}</HeaderIcon>
              </Animated.View>
            ),
          headerRight: () => <Dots isAnimating={false} />,
          headerRightContainerStyle: {
            top: 24,
            bottom: 24,
            right: 24,
            position: "absolute",
          },
          tabBarStyle: {
            height: 75,
            boxShadow: "0px -5px 15px rgba(10, 73, 119, 0.1)",
            elevation: 20,
          },
          tabBarActiveTintColor: "#0A4977",
          tabBarInactiveTintColor: "#94A3B8",
          tabBarShowLabel: false,
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Početna",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.staticIconContainer}>
                <Home
                  color={focused ? "#0A4977" : color}
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "Chatbot",
            tabBarIcon: ({ focused }) => (
              <Sparkles
                color="#ffffff"
                size={28}
                strokeWidth={2.5}
                fill={focused ? "#fff" : "transparent"}
              />
            ),
            tabBarButton: ({ children, style, ...props }) => (
              <View style={styles.centerButtonContainer}>
                <PlatformPressable
                  {...props}
                  style={styles.centerButton}>
                  <LinearGradient
                    colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.centerButtonGradient}>
                    {children}
                  </LinearGradient>
                </PlatformPressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Raspored",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.staticIconContainer}>
                <Calendar
                  color={focused ? "#0A4977FF" : color}
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  staticIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerButtonContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    marginTop: -15,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 8px 30px 30px rgba(45, 150, 224, 0.25)",
    elevation: 12,
  },
  centerButtonGradient: {
    width: "100%",
    height: "100%",
    paddingBottom: 4,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
