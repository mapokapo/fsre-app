import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export type HeaderButtonProps = TouchableOpacityProps;

export default function HeaderButton({ onPress, children }: HeaderButtonProps) {
  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={onPress}
      activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    marginLeft: 16,
  },
});
