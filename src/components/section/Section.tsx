import { PropsWithChildren } from "react";
import { StyleSheet, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

export type SectionProps = PropsWithChildren & AnimatedProps<ViewProps>;

export default function Section({ children, ...props }: SectionProps) {
  return (
    <Animated.View
      style={styles.section}
      {...props}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 26,
    marginBottom: 40,
  },
});
