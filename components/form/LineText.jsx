import { View, Text, TextInput } from "react-native";

export function LineText({ name, value, state }) {
  return (
    <View className="flex-row items-center justify-between px-3 py-2">
      <Text className="text-lg text-black capitalize dark:text-stone-50">{name}</Text>
      <TextInput
        value={value}
        onChangeText={state}
        className="w-1/2 px-2 py-1 text-gray-700 border rounded rou dark:stone-50 bg-blue-50"
      />
    </View>
  );
}
