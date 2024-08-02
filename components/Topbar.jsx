import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add, Edit } from "./Icons";
import { useCounter } from '../app/context';

export function Topbar({ title }) {
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();

  return (
    <View className="flex-row items-center justify-between px-3 py-2 bg-red-600">
      <Text className="text-4xl font-bold" style={{ marginTop: insets.top }}>
        {title}
      </Text>
      <Link href={`/counter/edit/${counterId || 0}`} replace asChild style={{ marginTop: insets.top }}>
        {path === "/" ? <Add /> : regex.test(path) ? <Edit /> : null}
      </Link>
    </View>
  );
}
