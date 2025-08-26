import { useEffect } from "react";
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
    } else {
      scaleAnim1.value = 1;
      scaleAnim2.value = 0.75;
      scaleAnim3.value = 0.5;
    }
  }, [isAnimating, scaleAnim1, scaleAnim2, scaleAnim3]);

  return (
    <View
      className="flex-row items-center"
      style={styles.headerDecoration}>
      <Animated.View
        className="mr-1 h-2 w-2 rounded-full"
        style={[animatedStyle1, { backgroundColor: color }]}
      />
      <Animated.View
        className="mr-1 h-2 w-2 rounded-full"
        style={[animatedStyle2, { backgroundColor: color }]}
      />
      <Animated.View
        className="mr-1 h-2 w-2 rounded-full"
        style={[animatedStyle3, { backgroundColor: color }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerDecoration: {
    flexDirection: "row",
    alignItems: "center",
  },
});
