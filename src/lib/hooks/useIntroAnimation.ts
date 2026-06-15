import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function useIntroAnimation() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withTiming(0, { duration: 800 });
  }, [fadeAnim, slideAnim]);

  const introAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const introAnimatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return { introAnimatedStyle, introAnimatedOpacityStyle };
}
