import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKEN_KEY = "expo_push_token";
const API_URL = "https://btl-tv.com/api/notifications/register";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }

  if (final !== "granted") {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: "6dc21843-cb64-4daf-940b-47b041d639d3",
  });

  const tokenStr = token.data;
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, tokenStr);

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenStr, platform: Platform.OS }),
    });
  } catch {
    // silently fail
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E50914",
    });
    await Notifications.setNotificationChannelAsync("live", {
      name: "Live TV",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E50914",
    });
    await Notifications.setNotificationChannelAsync("episodes", {
      name: "New Episodes",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E50914",
    });
  }

  return tokenStr;
}

export function addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
  return Notifications.addNotificationReceivedListener(handler);
}

export function addNotificationResponseListener(handler: (response: Notifications.NotificationResponse) => void) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
