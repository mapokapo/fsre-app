import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function useIntroAnimation() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  const introAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(fadeAnim.value, { duration: 800 }),
      transform: [
        { translateY: withTiming(slideAnim.value, { duration: 800 }) },
      ],
    }),
    [fadeAnim, slideAnim]
  );

  const introAnimatedOpacityStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(fadeAnim.value, { duration: 800 }),
    }),
    [fadeAnim]
  );

  useEffect(() => {
    fadeAnim.value = 1;
    slideAnim.value = 0;
  }, [fadeAnim, slideAnim]);

  return { introAnimatedStyle, introAnimatedOpacityStyle };
}
