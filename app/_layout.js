import { LogBox, UIManager, View, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { Topbar } from "../components/Topbar";
import { CounterProvider } from "../lib/counterContext";
import { I18nProvider } from "../lib/i18n";
import { ToastProvider } from "../lib/toastProvider";
import { normalizeLayoutMode } from "../lib/layoutMode";
import { useColorScheme } from "nativewind";
import { createTables, getConfig, syncDevelopmentPreviewData } from "../lib/db/database";
import { cancelCounterReminder, scheduleCounterReminder } from "../lib/notifications";

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.",
  "setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture",
]);

if (typeof UIManager.setLayoutAnimationEnabledExperimental === "function") {
  UIManager.setLayoutAnimationEnabledExperimental = () => {};
}

export default function Layout() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState("en");
  const [initialLayoutMode, setInitialLayoutMode] = useState("list");

  useEffect(() => {
    const tablesCreated = createTables();
    if (!tablesCreated) {
      setColorScheme("light");
      setIsReady(true);
      return;
    }

    const storedTheme = getConfig("theme") ?? "light";
    const storedLanguage = getConfig("language") ?? "en";
    const storedLayoutMode = normalizeLayoutMode(getConfig("layoutMode"));
    setColorScheme(storedTheme);
    setInitialLanguage(storedLanguage);
    setInitialLayoutMode(storedLayoutMode);
    setIsReady(true);

    // Deferred: dev data cleanup and notification setup don't block the UI
    setTimeout(() => {
      syncDevelopmentPreviewData();
      const notificationsEnabled = getConfig("notificationsEnabled") === "true";
      if (notificationsEnabled) {
        const hour = Number.parseInt(getConfig("notificationHour") ?? "9", 10);
        const minute = Number.parseInt(getConfig("notificationMinute") ?? "0", 10);
        scheduleCounterReminder({
          hour: Number.isNaN(hour) ? 9 : hour,
          minute: Number.isNaN(minute) ? 0 : minute,
          language: storedLanguage,
        }).catch(() => {});
      } else {
        cancelCounterReminder().catch(() => {});
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        animated
        backgroundColor="transparent"
        translucent
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <ToastProvider>
        <I18nProvider initialLanguage={initialLanguage}>
          <CounterProvider initialLayoutMode={initialLayoutMode}>
            <View className="flex-1 bg-stone-100 dark:bg-stone-950">
              <Stack
                screenOptions={{
                  header: () => <Topbar />,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
            </View>
          </CounterProvider>
        </I18nProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}
