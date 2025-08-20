import HeaderDots from "@/components/header/HeaderDots";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useCallback, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type HeaderProps = React.PropsWithChildren & {
  isMain?: boolean;
  animatedStyle?: ViewStyle;
};

export default function Header({ isMain = false, children }: HeaderProps) {
  let headerIcon: ReactNode | null = null;
  let headerButton: ReactNode | null = null;
  let headerIntro: ReactNode | null = null;
  let headerTitle: ReactNode | null = null;
  let headerSubtitle: ReactNode | null = null;
  const defaultChildren: ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;

    if (typeof child.type === "string" || !("name" in child.type)) return;

    switch (child.type.name) {
      case "HeaderIcon":
        headerIcon = child;
        break;
      case "HeaderButton":
        headerButton = child;
        break;
      case "HeaderIntro":
        headerIntro = child;
        break;
      case "HeaderTitle":
        headerTitle = React.cloneElement(
          child as React.ReactElement<{ isIntro?: boolean }>,
          {
            isIntro: isMain,
          }
        );
        break;
      case "HeaderSubtitle":
        headerSubtitle = React.cloneElement(
          child as React.ReactElement<{ isIntro?: boolean }>,
          { isIntro: isMain }
        );
        break;
      default:
        defaultChildren.push(child);
    }
  });

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
    <LinearGradient
      colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}>
      <Animated.View style={[styles.headerContent, animatedStyle]}>
        <View style={styles.headerLeft}>
          {headerIcon}
          <View>
            {headerIntro}
            {headerTitle}
            {headerSubtitle}
          </View>
        </View>

        {defaultChildren}

        {headerButton ?? <HeaderDots />}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerMainContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
});
