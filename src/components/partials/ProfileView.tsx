import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import MockData from "@/lib/const/mockData";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { THEME } from "@/lib/theme";
import { LinearGradient } from "expo-linear-gradient";
import { UserIcon } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function ProfileView() {
  const { colorScheme } = useColorScheme();
  const profile = useMemo(() => MockData.getProfile(), []);
  const { t } = useTranslation();

  return (
    <View className="items-center justify-center">
      <View className="mb-4">
        <LinearGradient
          colors={[
            THEME[colorScheme].fsreGradient1,
            THEME[colorScheme].fsreGradient2,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-20 w-20 items-center justify-center overflow-hidden rounded-full">
          <Icon
            as={UserIcon}
            className="text-fsre-gradient-foreground"
            size={32}
            strokeWidth={2.5}
          />
        </LinearGradient>
      </View>

      <View className="items-center gap-2">
        <Text className="text-lg font-bold">{profile.name}</Text>
        <Text className="text-sm font-semibold text-fsre-gradient-3">
          {t("profile.indexNumber", { index: profile.indexNumber })}
        </Text>
        <View className="mb-2 flex-row items-center">
          <Text className="text-sm text-muted-foreground">
            {t(`common.studyYearEnum.${profile.year}`)}
          </Text>
          <View className="mx-2 h-1 w-1 rounded-full bg-muted-foreground" />
          <Text className="text-sm text-muted-foreground">
            {t(`common.departmentEnum.${profile.department}`)}
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground">{profile.email}</Text>
      </View>
    </View>
  );
}
