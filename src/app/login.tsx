import useIntroAnimation from "@/hooks/useIntroAnimation";
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
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function LoginScreen() {
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
      setError("Molimo unesite pristupni kod");
      return;
    }

    if (accessCode.length < 6) {
      setError("Pristupni kod mora imati najmanje 6 znakova");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      // Mock validation - in real app this would be API call
      const validCodes = ["FSRE2024", "STUDENT123", "DEMO2024"];

      if (validCodes.includes(accessCode.toUpperCase())) {
        // Success - navigate to main app
        router.replace("/(tabs)");
      } else {
        setError(
          "Neispravni pristupni kod. Molimo kontaktirajte administraciju."
        );
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
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Background Gradient */}
        <LinearGradient
          colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>

        <Animated.View style={[styles.content, introAnimatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(255, 255, 255, 0.1)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}>
                <Text style={styles.logoText}>FSRE</Text>
              </LinearGradient>
            </View>

            <Text style={styles.title}>Dobrodošli na FSRE</Text>
            <Text style={styles.subtitle}>
              Fakultet strojarstva, računarstva i elektrotehnike
            </Text>
            <Text style={styles.description}>
              Unesite pristupni kod koji ste dobili od administracije
            </Text>
          </View>

          {/* Login Form */}
          <Animated.View style={[styles.formContainer, shakeAnimatedStyle]}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.95)",
                "rgba(248, 250, 252, 0.95)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.formGradient}>
              {/* Access Code Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Pristupni kod</Text>

                <View
                  style={[styles.inputContainer, error && styles.inputError]}>
                  <View style={styles.inputIcon}>
                    <Key
                      color="#0A4977"
                      size={20}
                      strokeWidth={2.5}
                    />
                  </View>

                  <TextInput
                    style={styles.textInput}
                    placeholder="Unesite pristupni kod"
                    placeholderTextColor="#94A3B8"
                    value={accessCode}
                    onChangeText={handleCodeChange}
                    onSubmitEditing={handleLogin}
                    secureTextEntry={!showCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={20}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCode(!showCode)}
                    activeOpacity={0.7}>
                    {showCode ? (
                      <EyeOff
                        color="#64748B"
                        size={20}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Eye
                        color="#64748B"
                        size={20}
                        strokeWidth={2.5}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Error Message */}
                {error ? (
                  <View style={styles.errorContainer}>
                    <AlertCircle
                      color="#DC2626"
                      size={16}
                      strokeWidth={2.5}
                    />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={
                    isLoading ? ["#94A3B8", "#94A3B8"] : ["#0A4977", "#1E5A8A"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginButtonGradient}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingDot} />
                      <Text style={styles.loginButtonText}>Provjera...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.loginButtonText}>Prijavite se</Text>
                      <ArrowRight
                        color="#ffffff"
                        size={20}
                        strokeWidth={2.5}
                      />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Shield
                  color="#059669"
                  size={16}
                  strokeWidth={2.5}
                />
                <Text style={styles.securityText}>
                  Vaši podaci su sigurni i zaštićeni
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Trebate pomoć?</Text>
            <Text style={styles.helpText}>
              Kontaktirajte studentsku službu na{"\n"}
              <Text style={styles.helpContact}>info@fsre.sum.ba</Text> ili{" "}
              <Text style={styles.helpContact}>+387 36 355 025</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A4977",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    left: -50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 64,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
    elevation: 12,
  },
  logoText: {
    fontSize: 36,
    fontFamily: "Inter-ExtraBold",
    color: "#ffffff",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 32,
  },
  formGradient: {
    borderRadius: 24,
    padding: 28,
    boxShadow: "0px 12px 20px rgba(10, 73, 119, 0.3)",
    elevation: 15,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#1A1A1A",
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#DC2626",
    marginLeft: 6,
    flex: 1,
  },
  loginButton: {
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 56,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  securityText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#059669",
    marginLeft: 6,
  },
  helpSection: {
    alignItems: "center",
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  helpContact: {
    fontFamily: "Inter-SemiBold",
    color: "rgba(255, 255, 255, 0.9)",
  },
});
