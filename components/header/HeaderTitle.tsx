import { PropsWithChildren } from "react";
import { StyleSheet, Text } from "react-native";

export type HeaderTitleProps = PropsWithChildren & {
  isIntro?: boolean;
};

export default function HeaderTitle({
  isIntro = false,
  children,
}: HeaderTitleProps) {
  return (
    <Text style={isIntro ? styles.headerIntroTitle : styles.headerTitle}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerIntroTitle: {
    fontSize: 48,
    fontFamily: "Inter-ExtraBold",
    color: "#ffffff",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: "1%",
  },
});
