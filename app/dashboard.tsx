import { LinearGradient } from "expo-linear-gradient";
import {
  Building,
  CircleCheck as CheckCircle,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  Key,
  User as UserIcon,
  UserPlus,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface User {
  id: string;
  type: "student" | "professor";
  firstName: string;
  lastName: string;
  identifier: string;
  department: string;
  accessCode: string;
  createdAt: string;
}

export default function AdminDashboard() {
  // Form state
  const [userType, setUserType] = useState<"student" | "professor">("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [department, setDepartment] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Users list state
  const [users, setUsers] = useState<User[]>([]);
  const [showCodes, setShowCodes] = useState<{ [key: string]: boolean }>({});

  // Mock data for demonstration
  React.useEffect(() => {
    // Simulate loading existing users
    const mockUsers: User[] = [
      {
        id: "1",
        type: "student",
        firstName: "Marko",
        lastName: "Petrović",
        identifier: "R-2021/0123",
        department: "Računarstvo",
        accessCode: "FSRE2024",
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        type: "professor",
        firstName: "Dr. Ana",
        lastName: "Marić",
        identifier: "PROF001",
        department: "Matematika",
        accessCode: "PROF2024",
        createdAt: "2024-01-14T14:20:00Z",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const generateAccessCode = () => {
    const prefix = userType === "student" ? "STU" : "PROF";
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomPart}`;
  };

  const handleGenerateCode = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !identifier.trim() ||
      !department.trim()
    ) {
      Alert.alert("Greška", "Molimo unesite sve potrebne podatke");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newCode = generateAccessCode();
      const newUser: User = {
        id: Date.now().toString(),
        type: userType,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        identifier: identifier.trim(),
        department: department.trim(),
        accessCode: newCode,
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [newUser, ...prev]);
      setGeneratedCode(newCode);

      // Clear form
      setFirstName("");
      setLastName("");
      setIdentifier("");
      setDepartment("");

      setIsLoading(false);
      Alert.alert("Uspjeh", `Pristupni kod je generiran: ${newCode}`);
    }, 1500);
  };

  const copyToClipboard = (code: string) => {
    // In a real app, you'd use Clipboard API
    Alert.alert("Kopirano", `Kod ${code} je kopiran u clipboard`);
  };

  const toggleShowCode = (userId: string) => {
    setShowCodes(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#0A4977", "#1E5A8A", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Users
                color="#ffffff"
                size={28}
                strokeWidth={2.5}
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>Admin Dashboard</Text>
              <Text style={styles.headerSubtitle}>
                Upravljanje pristupnim kodovima
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsNumber}>{users.length}</Text>
            <Text style={styles.statsLabel}>Korisnika</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Form Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserPlus
              color="#0A4977"
              size={24}
              strokeWidth={2.5}
            />
            <Text style={styles.sectionTitle}>Dodaj novog korisnika</Text>
          </View>

          <View style={styles.formCard}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.95)",
                "rgba(248, 250, 252, 0.95)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.formGradient}>
              {/* User Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tip korisnika</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      userType === "student" && styles.typeButtonActive,
                    ]}
                    onPress={() => setUserType("student")}>
                    <GraduationCap
                      color={userType === "student" ? "#ffffff" : "#64748B"}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        userType === "student" && styles.typeButtonTextActive,
                      ]}>
                      Student
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      userType === "professor" && styles.typeButtonActive,
                    ]}
                    onPress={() => setUserType("professor")}>
                    <UserIcon
                      color={userType === "professor" ? "#ffffff" : "#64748B"}
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        userType === "professor" && styles.typeButtonTextActive,
                      ]}>
                      Profesor
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Name Inputs */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Ime</Text>
                  <View style={styles.inputContainer}>
                    <UserIcon
                      color="#64748B"
                      size={18}
                      strokeWidth={2.5}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Unesite ime"
                      placeholderTextColor="#94A3B8"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Prezime</Text>
                  <View style={styles.inputContainer}>
                    <UserIcon
                      color="#64748B"
                      size={18}
                      strokeWidth={2.5}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Unesite prezime"
                      placeholderTextColor="#94A3B8"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              </View>

              {/* Identifier Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {userType === "student" ? "Broj indeksa" : "ID profesora"}
                </Text>
                <View style={styles.inputContainer}>
                  <Hash
                    color="#64748B"
                    size={18}
                    strokeWidth={2.5}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      userType === "student" ? "R-2024/0001" : "PROF001"
                    }
                    placeholderTextColor="#94A3B8"
                    value={identifier}
                    onChangeText={setIdentifier}
                  />
                </View>
              </View>

              {/* Department Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {userType === "student" ? "Smjer" : "Odjel"}
                </Text>
                <View style={styles.inputContainer}>
                  <Building
                    color="#64748B"
                    size={18}
                    strokeWidth={2.5}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      userType === "student" ? "Računarstvo" : "Matematika"
                    }
                    placeholderTextColor="#94A3B8"
                    value={department}
                    onChangeText={setDepartment}
                  />
                </View>
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  isLoading && styles.generateButtonDisabled,
                ]}
                onPress={handleGenerateCode}
                disabled={isLoading}>
                <LinearGradient
                  colors={
                    isLoading ? ["#94A3B8", "#94A3B8"] : ["#0A4977", "#1E5A8A"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.generateButtonGradient}>
                  <Key
                    color="#ffffff"
                    size={20}
                    strokeWidth={2.5}
                  />
                  <Text style={styles.generateButtonText}>
                    {isLoading ? "Generiranje..." : "Generiraj pristupni kod"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Generated Code Display */}
              {generatedCode && (
                <View style={styles.generatedCodeContainer}>
                  <View style={styles.generatedCodeHeader}>
                    <CheckCircle
                      color="#059669"
                      size={20}
                      strokeWidth={2.5}
                    />
                    <Text style={styles.generatedCodeTitle}>
                      Generirani kod:
                    </Text>
                  </View>
                  <View style={styles.generatedCodeBox}>
                    <Text style={styles.generatedCodeText}>
                      {generatedCode}
                    </Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard(generatedCode)}>
                      <Copy
                        color="#0A4977"
                        size={18}
                        strokeWidth={2.5}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>

        {/* Users List Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users
              color="#0A4977"
              size={24}
              strokeWidth={2.5}
            />
            <Text style={styles.sectionTitle}>
              Popis korisnika ({users.length})
            </Text>
          </View>

          <View style={styles.usersList}>
            {users.map(user => (
              <View
                key={user.id}
                style={styles.userCard}>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.95)",
                    "rgba(248, 250, 252, 0.95)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.userCardGradient}>
                  <View style={styles.userCardHeader}>
                    <View style={styles.userInfo}>
                      <View
                        style={[
                          styles.userTypeIcon,
                          {
                            backgroundColor:
                              user.type === "student" ? "#E0F2FE" : "#F0FDF4",
                          },
                        ]}>
                        {user.type === "student" ? (
                          <GraduationCap
                            color="#0369A1"
                            size={18}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <UserIcon
                            color="#059669"
                            size={18}
                            strokeWidth={2.5}
                          />
                        )}
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>
                          {user.firstName} {user.lastName}
                        </Text>
                        <Text style={styles.userMeta}>
                          {user.identifier} • {user.department}
                        </Text>
                        <Text style={styles.userDate}>
                          Kreiran: {formatDate(user.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.userCodeSection}>
                    <View style={styles.codeContainer}>
                      <Text style={styles.codeLabel}>Pristupni kod:</Text>
                      <View style={styles.codeBox}>
                        <Text style={styles.codeText}>
                          {showCodes[user.id] ? user.accessCode : "••••••••"}
                        </Text>
                        <TouchableOpacity
                          style={styles.toggleCodeButton}
                          onPress={() => toggleShowCode(user.id)}>
                          {showCodes[user.id] ? (
                            <EyeOff
                              color="#64748B"
                              size={16}
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Eye
                              color="#64748B"
                              size={16}
                              strokeWidth={2.5}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.copyCodeButton}
                          onPress={() => copyToClipboard(user.accessCode)}>
                          <Copy
                            color="#0A4977"
                            size={16}
                            strokeWidth={2.5}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  statsNumber: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginLeft: 12,
  },
  formCard: {
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0px 8px 20px rgba(10, 73, 119, 0.12)",
    elevation: 10,
  },
  formGradient: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  typeButtonActive: {
    backgroundColor: "#0A4977",
    borderColor: "#0A4977",
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#64748B",
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: "#ffffff",
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
    minHeight: 52,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: "#1A1A1A",
    paddingVertical: 12,
    paddingLeft: 12,
  },
  generateButton: {
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
    marginLeft: 8,
  },
  generatedCodeContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  generatedCodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  generatedCodeTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#059669",
    marginLeft: 6,
  },
  generatedCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  generatedCodeText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#059669",
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(10, 73, 119, 0.08)",
    elevation: 6,
  },
  userCardGradient: {
    padding: 20,
  },
  userCardHeader: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
    marginBottom: 2,
  },
  userDate: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#94A3B8",
  },
  userCodeSection: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  codeContainer: {
    gap: 8,
  },
  codeLabel: {
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  codeText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#0A4977",
    letterSpacing: 1,
  },
  toggleCodeButton: {
    padding: 6,
    marginRight: 4,
  },
  copyCodeButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
});
