import { Ionicons } from "@expo/vector-icons";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        // potpuno prilagođeni stil bar-a
        tabBarStyle: styles.tabBar,
        // ikona + label za Početna i Raspored
        tabBarIcon: ({ focused }) => {
          if (route.name === "chatbot") return null;
          const iconName =
            route.name === "news"
              ? "home-outline"
              : route.name === "schedule"
                ? "calendar-outline"
                : "ellipse-outline";
          const label =
            route.name === "news"
              ? "Početna"
              : route.name === "schedule"
                ? "Raspored"
                : "";
          return (
            <View style={styles.tabItem}>
              <Ionicons
                name={iconName as any}
                size={24}
                color={focused ? "#0A4977" : "#999"}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {label}
              </Text>
            </View>
          );
        },
        // posebna logika za Chatbot gumb
        tabBarButton: props => {
          if (route.name === "chatbot") {
            return (
              <PlatformPressable
                {...props}
                style={styles.chatWrapper}>
                <View style={styles.chatButton}>
                  <Ionicons
                    name="chatbubbles-outline"
                    size={28}
                    color="#fff"
                  />
                </View>
              </PlatformPressable>
            );
          }
          return (
            <PlatformPressable
              {...props}
              style={styles.regularWrapper}
            />
          );
        },
      })}>
      <Tabs.Screen
        name="news"
        options={{ title: "Početna" }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{ title: "Chatbot" }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: "Raspored" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.select({ ios: 20, android: 10 }),
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // lagani shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  regularWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
    fontFamily: "Helvetica",
  },
  labelActive: {
    color: "#0A4977",
  },
  chatWrapper: {
    position: "absolute",
    top: -30,
    width: 70,
    height: 70,
    left: (width - 70) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#0A4977",
    alignItems: "center",
    justifyContent: "center",
    // glow efekat
    shadowColor: "#0A4977",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
});
