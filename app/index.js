import { View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Main } from "../components/Main";
import { createTables } from "./db/database";

export default function Index() {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <StatusBar animated={true} backgroundColor="black" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}
