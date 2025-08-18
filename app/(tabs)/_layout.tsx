import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Calendar, Home, Sparkles } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
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
    marginTop: "-30%",
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
