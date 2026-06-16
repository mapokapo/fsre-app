import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { MoonStar, Sun } from "lucide-react-native";
import { View } from "react-native";

export default function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    setColorScheme(isDarkColorScheme ? "light" : "dark");
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onPress={toggleColorScheme}
      className="active:opacity-70 web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2">
      <View className="aspect-square flex-1 items-center justify-center pt-0.5 web:px-5">
        {isDarkColorScheme ? (
          <Icon
            as={MoonStar}
            size={23}
            strokeWidth={1.25}
          />
        ) : (
          <Icon
            as={Sun}
            size={24}
            strokeWidth={1.25}
          />
        )}
      </View>
    </Button>
  );
}
