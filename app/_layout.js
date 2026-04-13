import { View } from "react-native";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { Topbar } from "../components/Topbar";
import { CounterProvider } from './context';
import { useColorScheme } from "nativewind";
import { createTables, getConfig } from "../app/db/database";

/**
 * Root layout that initializes app state and top-level navigation shell.
 * @returns {JSX.Element | null}
 */
export default function Layout() {
  const { setColorScheme } = useColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const tablesCreated = createTables();
    if (!tablesCreated) {
      setColorScheme("light");
      setIsThemeLoaded(true);
      return;
    }

    const loadTheme = () => {
      const storedTheme = getConfig("theme") ?? "light";
      setColorScheme(storedTheme);
      setIsThemeLoaded(true);
    };

    loadTheme();
  }, []);

  if (!isThemeLoaded) {return null;}
  
  return (
    <CounterProvider>
      <View className="flex-1">
        <Stack
          screenOptions={{
            header: () => <Topbar title={"Counters"} />,
          }}
        />
      </View>
    </CounterProvider>
  );
}
