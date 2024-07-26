import { View } from "react-native";
import { Stack } from "expo-router";
import { Topbar } from "../components/Topbar";

export default function Layout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          header: () => <Topbar title={"Counters"} />,
        }}
      />
    </View>
  );
}
