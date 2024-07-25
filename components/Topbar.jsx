import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Add } from "./Icons";

export function Topbar() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-row items-center justify-between px-3 py-2 bg-red-600">
      <Text className="text-4xl font-bold" style={{ marginTop: insets.top }}>
        TopBar
      </Text>
      <Link href="/0" asChild style={{ marginTop: insets.top }}>
        <Add />
      </Link>
    </View>
  );
}
