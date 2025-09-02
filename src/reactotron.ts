import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "FSRE App",
  })
  .useReactNative()
  .connect();
