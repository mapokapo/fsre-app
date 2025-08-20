import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export default function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardShow =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHide =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(keyboardShow, () => {
      setIsKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener(keyboardHide, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return { isKeyboardVisible };
}
