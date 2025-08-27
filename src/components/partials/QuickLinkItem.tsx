import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import QuickLink from "@/lib/types/QuickLink";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Linking } from "react-native";

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
    <Button
      variant="ghost"
      className="h-auto w-[47.5%] flex-col items-center rounded-2xl bg-card-gradient-1 p-6 shadow-md web:!h-auto web:w-full"
      onPress={() => handleQuickLinkPress(link)}>
      <LinearGradient
        colors={[link.gradientFrom, link.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-12 w-12 items-center justify-center overflow-hidden rounded-full">
        <Icon
          as={link.icon}
          className="text-fsre-gradient-foreground"
          size={22}
          strokeWidth={2.5}
        />
      </LinearGradient>
      <Text className="text-center font-semibold">{link.label}</Text>
    </Button>
  );
}
