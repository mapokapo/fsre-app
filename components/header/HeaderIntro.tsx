import { PropsWithChildren } from "react";
import { StyleSheet, Text } from "react-native";

export type HeaderIntroProps = PropsWithChildren;

export default function HeaderIntro({ children }: HeaderIntroProps) {
  return <Text style={styles.headerIntro}>{children}</Text>;
}

const styles = StyleSheet.create({
  headerIntro: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Inter-Medium",
    marginBottom: 12,
  },
});
