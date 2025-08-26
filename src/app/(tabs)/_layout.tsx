import Dots from "@/components/Dots";
import HeaderBackground from "@/components/header/HeaderBackground";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { PlatformPressable } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname } from "expo-router";
import { Calendar, Home, LucideIcon, Sparkles } from "lucide-react-native";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const routePathNameToHeaderData: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: LucideIcon | null;
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
    icon: Sparkles,
    isMain: false,
  },
  "/timetable": {
    title: "Raspored",
    subtitle: "Predavanja i vježbe",
    icon: Calendar,
    isMain: false,
  },
};

export default function TabLayout() {
  const pathname = usePathname();
  const headerData = routePathNameToHeaderData[pathname];
  const { introAnimatedStyle } = useIntroAnimation();
  const { colorScheme } = useColorScheme();

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
              {headerData.isMain && (
                <Text className="mb-1 text-primary-foreground/90">
                  Dobrodošli na
                </Text>
              )}
              <Text
                className={cn(
                  "text-xl font-bold text-primary-foreground",
                  headerData.isMain &&
                    "mb-2 text-5xl font-extrabold tracking-widest shadow-lg"
                )}>
                {headerData.title}
              </Text>
              <Text
                className={cn(
                  "text-sm text-primary-foreground/80",
                  headerData.isMain && "text-base"
                )}>
                {headerData.subtitle}
              </Text>
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
                <Icon
                  className="mr-2 h-8 w-8 p-4 text-primary-foreground"
                  as={headerData.icon}
                />
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
          tabBarActiveTintColor: THEME[colorScheme].fsreGradient3,
          tabBarInactiveTintColor: THEME[colorScheme].mutedForeground,
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
            tabBarIcon: props => (
              <Icon
                as={Home}
                {...props}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "Chatbot",
            tabBarIcon: props => (
              <Icon
                as={Sparkles}
                {...props}
                className={cn(
                  "stroke-primary-foreground",
                  props.focused && "fill-primary-foreground"
                )}
              />
            ),
            tabBarButton: ({ children, style, ...props }) => (
              <View className="w-full items-center justify-center">
                <PlatformPressable
                  {...props}
                  className="-mt-4 h-16 w-16 overflow-hidden rounded-full shadow-md">
                  <LinearGradient
                    colors={[
                      THEME[colorScheme].fsreGradient1,
                      THEME[colorScheme].fsreGradient2,
                      THEME[colorScheme].fsreGradient3,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="h-full w-full items-center justify-center rounded-full pb-1">
                    {children}
                  </LinearGradient>
                </PlatformPressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="timetable"
          options={{
            title: "Raspored",
            tabBarIcon: props => (
              <Icon
                as={Calendar}
                {...props}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
