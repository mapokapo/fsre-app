import {
  HeaderIcon,
  HeaderIntro,
  HeaderSubtitle,
  HeaderTitle,
} from "@/components/header";
import HeaderBackground from "@/components/header/HeaderBackground";
import HeaderDots from "@/components/header/HeaderDots";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname } from "expo-router";
import { Calendar, Home, Sparkles } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            height: "100%",
          },
          headerBackground: () => <HeaderBackground />,
          headerTitleContainerStyle: {
            paddingTop: 24,
            paddingBottom: 24,
          },
          headerTitle: () => (
            <Animated.View style={animatedStyle}>
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
              <Animated.View style={animatedStyle}>
                <HeaderIcon>{headerData.icon}</HeaderIcon>
              </Animated.View>
            ),
          headerRight: () => <HeaderDots />,
          headerRightContainerStyle: {
            paddingTop: 24,
            paddingBottom: 24,
            paddingRight: 24,
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
              <View style={styles.centerButtonContainer}>
                <LinearGradient
                  colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.centerButton}>
                  <Sparkles
                    color="#ffffff"
                    size={28}
                    strokeWidth={2.5}
                    fill={focused ? "#ffffff" : "transparent"}
                  />
                </LinearGradient>
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
                  color={focused ? "#0A4977" : color}
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  staticIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerButtonContainer: {
    marginTop: -30,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 9999,
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 8px 15px rgba(10, 73, 119, 0.25)",
    elevation: 12,
  },
});
