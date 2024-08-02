import { View, Text } from "react-native";

export function Registry({ registry }) {
  return (
    <View className="flex-row items-center justify-around p-1 mx-auto bg-gray-200 border border-gray-400 rounded-md">
      <Text className="w-1/2 text-xl text-center border-r border-gray-400">
        {registry.date.substring(8,10) + "/" + registry.date.substring(5,7) + "/" + registry.date.substring(0,4)}
      </Text>
      <Text className="w-1/2 text-2xl text-center">{registry.value}</Text>
    </View>
  );
}
