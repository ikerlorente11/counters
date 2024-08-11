import { View, Text, Pressable } from "react-native";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add, Edit, Light, Dark } from './Icons';
import { useCounter } from "../app/context";
import { updateConfig, getConfig } from "../app/db/database";
import { useColorScheme } from "nativewind";

export function Topbar({ title }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();

  useEffect(() => {
    updateConfig({ field: "theme", value: colorScheme });
  }, [colorScheme]);

  return (
    <View
      className="relative flex-row items-end justify-between px-3 py-2 bg-blue-600 dark:bg-stone-900"
      style={{ paddingTop: insets.top + 10 }}
    >
      <Pressable onPress={toggleColorScheme} className="z-10">
        {colorScheme === "dark" ? <Light size={40} className="text-blue-100 dark:text-stone-100" /> : <Dark size={40} className="text-blue-100 dark:text-stone-100" />}
      </Pressable>
      <Text className="absolute inset-x-0 z-0 mx-auto text-4xl font-bold text-center text-blue-100 dark:text-stone-100">{title}</Text>
      <Link href={`/counter/edit/${counterId || 0}`} className="z-10" asChild>
        {path === "/" ? <Add className="text-blue-100 dark:text-stone-100" /> : regex.test(path) ? <Edit className="text-blue-100 dark:text-stone-100" /> : null}
      </Link>
    </View>
  );
}
