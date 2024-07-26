import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { Add } from "./Icons";

export function Topbar({ title }) {
  const insets = useSafeAreaInsets();
  const path = usePathname();

  return (
    <View className="flex-row items-center justify-between px-3 py-2 bg-red-600">
      <Text className="text-4xl font-bold" style={{ marginTop: insets.top }}>
        {title}
      </Text>
      <Link href="/0" asChild style={{ marginTop: insets.top }}>
        {path === "/" && <Add />}
      </Link>
    </View>
  );
}
