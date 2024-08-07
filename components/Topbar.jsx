import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add, Edit, Light, Dark } from "./Icons";
import { useCounter } from "../app/context";
import { useColorScheme } from "nativewind";

export function Topbar({ title }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();

  return (
    <View
      className="flex-row items-end justify-between px-3 py-2 bg-red-600 dark:bg-red-900"
      style={{ paddingTop: insets.top }}
    >
      <Text className="text-4xl font-bold">{title}</Text>
      <Pressable onPress={toggleColorScheme}>
        {colorScheme === "light" ? <Dark size={40} /> : <Light size={40} />}
      </Pressable>
      <Link href={`/counter/edit/${counterId || 0}`} replace asChild>
        {path === "/" ? <Add /> : regex.test(path) ? <Edit /> : null}
      </Link>
    </View>
  );
}
