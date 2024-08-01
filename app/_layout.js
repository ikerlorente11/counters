import { View } from "react-native";
import { Stack } from "expo-router";
import { Topbar } from "../components/Topbar";
import { CounterProvider } from './context';

export default function Layout() {
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
