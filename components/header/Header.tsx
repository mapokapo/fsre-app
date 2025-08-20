import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export type HeaderProps = React.PropsWithChildren & {
  isMain?: boolean;
  animatedStyle?: ViewStyle;
};

export default function Header({
  isMain = false,
  animatedStyle,
  children,
}: HeaderProps) {
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

        {headerButton ?? (
          <View style={styles.headerDecoration}>
            <View style={styles.headerDot1} />
            <View style={styles.headerDot2} />
            <View style={styles.headerDot3} />
          </View>
        )}
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
  headerDecoration: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 4,
  },
  headerDot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 4,
  },
  headerDot3: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
