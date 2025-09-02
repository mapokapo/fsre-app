import { getApps, initializeApp } from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";
import { Platform } from "react-native";

export const firebaseConfig = {
  apiKey: "AIzaSyBl7SKSrU1u8QQwIgiaSpS8J70d7sET_TI",
  authDomain: "fsre-timetable-notify.firebaseapp.com",
  projectId: "fsre-timetable-notify",
  storageBucket: "fsre-timetable-notify.firebasestorage.app",
  messagingSenderId: "236658525220",
  appId: "1:236658525220:web:c04d689f7a7fe52edac4b1",
  measurementId: "G-46Q0F88MKK",
  databaseURL:
    "https://fsre-timetable-notify-default-rtdb.europe-west1.firebasedatabase.app",
};

if (Platform.OS === "web" && getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export const messaging = Platform.OS === "web" ? null : getMessaging();
