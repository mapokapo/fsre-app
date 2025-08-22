import QuickLink from "@/lib/types/QuickLink";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, StyleSheet, Text } from "react-native";

export type QuickLinkItemProps = {
  link: QuickLink;
};

export default function QuickLinkItem({ link }: QuickLinkItemProps) {
  const router = useRouter();

  const handleQuickLinkPress = async (link: QuickLink) => {
    if ("action" in link && link.action === "navigate") {
      router.push(link.to);
    } else if ("url" in link) {
      try {
        const supported = await Linking.canOpenURL(link.url);
        if (supported) {
          await Linking.openURL(link.url);
        } else {
          console.warn("Don't know how to open URI: " + link.url);
        }
      } catch (error) {
        console.error("Error opening URL:", error);
      }
    }
  };

  return (
    <Pressable
      style={styles.linkCard}
      onPress={() => handleQuickLinkPress(link)}>
      <LinearGradient
        colors={[link.gradientFrom, link.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linkIconContainer}>
        {React.cloneElement(
          link.icon as React.ReactElement<{
            color: string;
            size: number;
            strokeWidth: number;
          }>,
          {
            color: "#ffffff",
            size: 26,
            strokeWidth: 2.5,
          }
        )}
      </LinearGradient>
      <Text style={styles.linkText}>{link.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linkCard: {
    flex: 1,
    minWidth: 200,
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
});
