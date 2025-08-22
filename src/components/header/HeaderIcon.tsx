import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type HeaderIconProps = PropsWithChildren;

export default function HeaderIcon({ children }: HeaderIconProps) {
  return <View style={styles.headerIcon}>{children}</View>;
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
});
