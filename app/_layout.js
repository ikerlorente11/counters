import { View } from "react-native";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { Topbar } from "../components/Topbar";
import { CounterProvider } from './context';
import { useColorScheme } from "nativewind";
import { getConfig } from "../app/db/database";

export default function Layout() {
  const { setColorScheme } = useColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getConfig("theme");
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
