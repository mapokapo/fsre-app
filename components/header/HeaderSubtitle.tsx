import { PropsWithChildren } from "react";
import { StyleSheet, Text } from "react-native";

export type HeaderSubtitleProps = PropsWithChildren & {
  isIntro?: boolean;
};

export default function HeaderSubtitle({
  isIntro = false,
  children,
}: HeaderSubtitleProps) {
  return (
    <Text style={isIntro ? styles.headerIntroSubtitle : styles.headerSubtitle}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  headerIntroSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "Inter-Regular",
    lineHeight: 22,
  },
});
