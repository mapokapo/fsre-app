import Dots from "@/components/Dots";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { routeData } from "@/lib/const/routeData";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { NAV_THEME, THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { PlatformPressable } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname } from "expo-router";
import { Calendar, Home, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { t } = useTranslation();
  const pathname = usePathname() as "/" | "/chatbot" | "/timetable";
  const { introAnimatedStyle } = useIntroAnimation();
  const { colorScheme } = useColorScheme();

  const headerData = routeData[pathname];

  return (
    <View
      style={{ flex: 1 }}
      className="bg-background">
      <SafeAreaView
        edges={["bottom", "left", "right"]}
        style={{
          flex: 1,
          backgroundColor: NAV_THEME[colorScheme].colors.card,
        }}>
        <Tabs
          screenOptions={{
            headerShown: true,
            headerStyle: {
              height: headerData.isMain ? 200 : 120,
            },
            headerBackground: () => (
              <LinearGradient
                colors={[
                  THEME[colorScheme].fsreGradient1,
                  THEME[colorScheme].fsreGradient2,
                  THEME[colorScheme].fsreGradient3,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-full overflow-hidden rounded-bl-3xl rounded-br-3xl"></LinearGradient>
            ),
            headerTitleContainerStyle: {
              paddingTop: 24,
              paddingBottom: 24,
            },
            headerTitle: () => (
              <Animated.View style={introAnimatedStyle}>
                {headerData.isMain && (
                  <Text className="mb-1 text-primary-foreground/90">
                    {t("common.welcomeTo")}
                  </Text>
                )}
                {"image" in headerData ? (
                  headerData.image
                ) : (
                  <Text
                    className={cn(
                      "text-xl font-bold text-primary-foreground",
                      headerData.isMain &&
                        "mb-2 text-5xl font-extrabold tracking-widest"
                    )}>
                    {headerData.title(t)}
                  </Text>
                )}
                <Text
                  className={cn(
                    "text-sm text-primary-foreground/80",
                    headerData.isMain && "text-base"
                  )}>
                  {headerData.subtitle(t)}
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
                    className="mr-2 p-1 text-primary-foreground"
                    size={40}
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
              height: 60,
              boxShadow: "0px -10px 15px rgba(10, 73, 119, 0.1)",
              elevation: 0,
              backgroundColor: NAV_THEME[colorScheme].colors.card,
            },
            tabBarActiveTintColor: THEME[colorScheme].fsreGradient3,
            tabBarInactiveTintColor: THEME[colorScheme].mutedForeground,
            tabBarShowLabel: false,
            tabBarIconStyle: {
              marginTop: 5,
            },
            tabBarButton: ({ ...props }) => (
              <PlatformPressable
                {...props}
                hitSlop={10}
              />
            ),
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: t("navigation.home"),
              tabBarAccessibilityLabel: t("navigation.home"),
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
              title: t("navigation.chatbot"),
              tabBarAccessibilityLabel: t("navigation.chatbot"),
              tabBarIcon: props => (
                <Icon
                  as={Sparkles}
                  {...props}
                  className={cn(
                    "!h-full !w-full stroke-primary-foreground",
                    props.focused && "fill-primary-foreground"
                  )}
                />
              ),
              tabBarButton: ({
                children,
                style,
                pressColor,
                pressOpacity,
                ref,
                ...props
              }) => (
                <View className="w-full items-center justify-center">
                  <PlatformPressable
                    {...props}
                    style={{
                      marginTop: -24,
                      height: 64,
                      width: 64,
                      overflow: "hidden",
                      borderRadius: 9999,
                      padding: 0,
                      boxShadow: "0 3px 10px 1px rgba(0, 0, 0, 0.35",
                      elevation: 5,
                    }}>
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
              title: t("navigation.timetable"),
              tabBarAccessibilityLabel: t("navigation.timetable"),
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
    </View>
  );
}
