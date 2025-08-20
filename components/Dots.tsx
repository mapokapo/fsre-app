import { useCallback, useEffect } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type DotsProps = {
  isAnimating: boolean;
  color?: ColorValue;
};

export default function Dots({ isAnimating, color = "#FFFFFF99" }: DotsProps) {
  const scaleAnim1 = useSharedValue(1);
  const scaleAnim2 = useSharedValue(0.75);
  const scaleAnim3 = useSharedValue(0.5);

  const startAnimation = useCallback(() => {
    scaleAnim1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.5, { duration: 500 })
      ),
      -1,
      true
    );
    scaleAnim2.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        ),
        -1,
        true
      )
    );
    scaleAnim3.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        ),
        -1,
        true
      )
    );
  }, [scaleAnim1, scaleAnim2, scaleAnim3]);

  const stopAnimation = useCallback(() => {
    scaleAnim1.value = 1;
    scaleAnim2.value = 0.75;
    scaleAnim3.value = 0.5;
  }, [scaleAnim1, scaleAnim2, scaleAnim3]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim3.value }],
  }));

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isAnimating, startAnimation, stopAnimation]);

  return (
    <View style={styles.headerDecoration}>
      <Animated.View
        style={[styles.headerDot, animatedStyle1, { backgroundColor: color }]}
      />
      <Animated.View
        style={[styles.headerDot, animatedStyle2, { backgroundColor: color }]}
      />
      <Animated.View
        style={[styles.headerDot, animatedStyle3, { backgroundColor: color }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerDecoration: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});
