import * as React from "react";
import { Keyboard, type KeyboardEvent } from "react-native";

const EVENT_TYPE = {
  didShow: { show: "keyboardDidShow", hide: "keyboardDidHide" },
  willShow: { show: "keyboardWillShow", hide: "keyboardWillHide" },
} as const;

export function useKeyboard(
  { eventType = "didShow" }: { eventType?: keyof typeof EVENT_TYPE } = {
    eventType: "didShow",
  }
) {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showListener = Keyboard.addListener(
      EVENT_TYPE[eventType].show,
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideListener = Keyboard.addListener(
      EVENT_TYPE[eventType].hide,
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [eventType]);

  return {
    keyboardHeight,
  };
}
