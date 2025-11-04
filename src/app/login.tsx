import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import MockData from "@/lib/const/mockData";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import useIntroAnimation from "@/lib/hooks/useIntroAnimation";
import { useAuth } from "@/lib/state/authStore";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  CircleAlert as AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Key,
  Shield,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { setSession } = useAuth();

  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const { introAnimatedStyle } = useIntroAnimation();
  const shakeAnim = useSharedValue(0);

  const shakeAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: shakeAnim.value }],
    }),
    [shakeAnim]
  );

  useEffect(() => {
    if (error !== null) {
      shakeAnim.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [error, shakeAnim]);

  const handleLogin = async () => {
    if (!accessCode.trim()) {
      setError(t("auth.login.errors.empty"));
      return;
    }

    if (accessCode.length < 6) {
      setError(t("auth.login.errors.minLength"));
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - in real app this would be API call
      const validCodes = ["FSRE2024", "STUDENT123", "DEMO2024"];

      if (validCodes.includes(accessCode.toUpperCase())) {
        // Success - create user session
        setSession({ profile: MockData.getProfile(), token: "mock-token" });
        router.replace("/(tabs)");
      } else {
        setError(t("auth.login.errors.invalid"));
      }

      setIsLoading(false);
    }, 2000);
  };

  const handleCodeChange = (text: string) => {
    setAccessCode(text);
    if (error) {
      setError(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <LinearGradient
          className="absolute bottom-0 left-0 right-0 top-0"
          colors={[
            THEME[colorScheme].fsreGradient1,
            THEME[colorScheme].fsreGradient2,
            THEME[colorScheme].fsreGradient3,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View className="absolute bottom-0 left-0 right-0 top-0">
          <View
            className="absolute rounded-full bg-white/5"
            style={{
              width: 200,
              height: 200,
              top: -100,
              right: -100,
            }}
          />
          <View
            className="absolute rounded-full bg-white/5"
            style={{
              width: 200,
              height: 200,
              top: -100,
              right: -100,
            }}
          />
          <View
            className="absolute rounded-full bg-white/5"
            style={{
              width: 100,
              height: 100,
              left: -50,
            }}
          />
        </View>

        <Animated.View
          className="flex-1 justify-center px-6 pb-16 pt-20"
          style={introAnimatedStyle}>
          <View className="mb-10 items-center">
            <View className="mb-6">
              <LinearGradient
                className="elevation-xl h-32 w-32 items-center justify-center overflow-hidden rounded-full web:shadow-md"
                colors={[
                  THEME[colorScheme].fsreGradient3,
                  THEME[colorScheme].fsreGradient1,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text className="text-4xl font-extrabold tracking-widest text-white">
                  FSRE
                </Text>
              </LinearGradient>
            </View>

            <Text className="mb-2 text-center text-3xl font-bold text-fsre-gradient-foreground">
              {t("auth.login.title")}
            </Text>
            <Text className="mb-4 text-center text-fsre-gradient-foreground">
              {t("auth.login.subtitle")}
            </Text>
            <Text className="text-center text-sm leading-5 text-fsre-gradient-foreground/70">
              {t("auth.login.description")}
            </Text>
          </View>

          <Animated.View
            className="mb-8"
            style={shakeAnimatedStyle}>
            <LinearGradient
              className="elevation-xl overflow-hidden rounded-3xl p-8 web:shadow-xl"
              colors={[
                "rgba(255, 255, 255, 0.95)",
                "rgba(248, 250, 252, 0.95)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}>
              <View className="mb-6">
                <Text className="mb-3 font-semibold text-neutral-900">
                  {t("auth.login.accessCodeLabel")}
                </Text>

                <View
                  className={cn(
                    "flex-row items-center rounded-2xl border-2 border-border/60 px-4 py-1",
                    error && "border-destructive bg-destructive/10"
                  )}>
                  <View className="mr-3">
                    <Icon
                      as={Key}
                      className="stroke-fsre-gradient-3"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </View>

                  <Input
                    className="flex-1 !border-transparent !bg-transparent text-neutral-900 !outline-none placeholder:text-neutral-400"
                    placeholder={t("auth.login.accessCodePlaceholder")}
                    value={accessCode}
                    onChangeText={handleCodeChange}
                    onSubmitEditing={handleLogin}
                    secureTextEntry={!showCode}
                    autoCorrect={false}
                    maxLength={20}
                  />

                  <Button
                    className="ml-2 p-2"
                    variant="ghost"
                    onPress={() => setShowCode(!showCode)}>
                    {showCode ? (
                      <Icon
                        className="stroke-neutral-600"
                        as={EyeOff}
                        size={20}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Icon
                        className="stroke-neutral-600"
                        as={Eye}
                        size={20}
                        strokeWidth={2.5}
                      />
                    )}
                  </Button>
                </View>

                {error && (
                  <View className="mt-2 flex-row items-center px-1">
                    <Icon
                      as={AlertCircle}
                      className="stroke-destructive"
                      size={16}
                      strokeWidth={2.5}
                    />
                    <Text className="ml-1.5 flex-1 text-xs text-destructive">
                      {error}
                    </Text>
                  </View>
                )}
              </View>

              <Button
                className="mb-5 min-h-12 p-0 disabled:opacity-70"
                variant="ghost"
                disabled={isLoading}
                onPress={handleLogin}>
                <LinearGradient
                  colors={[
                    THEME[colorScheme].fsreGradient1,
                    THEME[colorScheme].fsreGradient2,
                    THEME[colorScheme].fsreGradient3,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-full w-full items-center justify-center overflow-hidden rounded-lg">
                  {isLoading ? (
                    <View className="flex-row items-center justify-center">
                      <View className="mr-2 h-1.5 w-1.5 rounded-full bg-fsre-gradient-foreground" />
                      <Text className="mr-2 text-lg font-bold !text-fsre-gradient-foreground">
                        {t("auth.login.validating")}
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center justify-center">
                      <Text className="mr-2 text-lg font-bold !text-fsre-gradient-foreground">
                        {t("auth.login.submit")}
                      </Text>
                      <Icon
                        className="stroke-fsre-gradient-foreground"
                        as={ArrowRight}
                        size={20}
                        strokeWidth={2.5}
                      />
                    </View>
                  )}
                </LinearGradient>
              </Button>

              <View className="flex-row items-center justify-center border-t border-t-card-gradient-1 pt-4">
                <Icon
                  as={Shield}
                  className="stroke-green-600/80"
                  size={16}
                  strokeWidth={2.5}
                />
                <Text className="ml-1.5 text-sm text-green-600/80">
                  {t("auth.securityNotice")}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View className="items-center">
            <Text className="mb-2 font-semibold text-fsre-gradient-foreground">
              {t("auth.help.title")}
            </Text>
            <Text className="text-center text-sm leading-4 text-fsre-gradient-foreground">
              {t("auth.help.contact", {
                email: "referada@fsre.sum.ba",
                phone: "+387 36 337 003",
              })}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
