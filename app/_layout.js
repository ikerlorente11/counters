import { LogBox, UIManager, View } from "react-native";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { Topbar } from "../components/Topbar";
import { CounterProvider } from "../lib/counterContext";
import { I18nProvider } from "../lib/i18n";
import { useColorScheme } from "nativewind";
import { createTables, ensureDevelopmentPreviewCounter, getConfig } from "../lib/db/database";

LogBox.ignoreLogs([
  "setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture.",
  "setLayoutAnimationEnabledExperimental is currently a no-op in the New Architecture",
]);

if (typeof UIManager.setLayoutAnimationEnabledExperimental === "function") {
  UIManager.setLayoutAnimationEnabledExperimental = () => {};
}

/**
 * Root layout that initializes app state and top-level navigation shell.
 * @returns {JSX.Element | null}
 */
export default function Layout() {
  const { setColorScheme } = useColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState("en");

  useEffect(() => {
    const tablesCreated = createTables();
    if (!tablesCreated) {
      setColorScheme("light");
      setIsThemeLoaded(true);
      return;
    }

    ensureDevelopmentPreviewCounter();

    const loadTheme = () => {
      const storedTheme = getConfig("theme") ?? "light";
      const storedLanguage = getConfig("language") ?? "en";
      setColorScheme(storedTheme);
      setInitialLanguage(storedLanguage);
      setIsThemeLoaded(true);
    };

    loadTheme();
  }, []);

  if (!isThemeLoaded) {return null;}
  
  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <CounterProvider>
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
  );
}
