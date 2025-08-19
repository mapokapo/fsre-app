import { mockProfileData } from "@/lib/const/mockData";
import { LinearGradient } from "expo-linear-gradient";
import { UserIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileView() {
  return (
    <>
      <View style={styles.studentAvatar}>
        <LinearGradient
          colors={["#0A4977", "#1E5A8A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.studentAvatarGradient}>
          <UserIcon
            color="#ffffff"
            size={32}
            strokeWidth={2.5}
          />
        </LinearGradient>
      </View>

      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>{mockProfileData.name}</Text>
        <Text style={styles.studentIndex}>
          Broj indeksa: {mockProfileData.indexNumber}
        </Text>
        <View style={styles.studentMeta}>
          <Text style={styles.studentYear}>{mockProfileData.year}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.studentDepartment}>
            {mockProfileData.department}
          </Text>
        </View>
        <Text style={styles.studentEmail}>{mockProfileData.email}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    alignItems: "center",
  },
  studentAvatar: {
    marginBottom: 16,
  },
  studentAvatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  studentDetails: {
    alignItems: "center",
  },
  studentName: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  studentIndex: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#0A4977",
    marginBottom: 8,
  },
  studentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  studentYear: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  studentDepartment: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#64748B",
  },
  studentEmail: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#94A3B8",
  },
});
