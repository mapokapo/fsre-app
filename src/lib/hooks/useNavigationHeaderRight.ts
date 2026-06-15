import { createElement, useLayoutEffect } from "react";

type NavigationWithHeaderRight = {
  setOptions: (options: {
    headerRight?: () => React.ReactElement | null;
  }) => void;
};

export function useNavigationHeaderRight<P extends object>(
  navigation: NavigationWithHeaderRight,
  Component: React.ComponentType<P>,
  props: P
) {
  useLayoutEffect(() => {
    function HeaderRight() {
      return createElement(Component, props);
    }

    navigation.setOptions({ headerRight: HeaderRight });
  }, [navigation, Component, props]);
}
