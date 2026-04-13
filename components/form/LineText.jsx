import { View, Text, TextInput } from "react-native";

/**
 * Reusable labeled input row.
 * @param {{name: string, value: string, state: (value: string) => void, keyboardType?: "default" | "numeric"}} props
 * @returns {JSX.Element}
 */
export function LineText({ name, value, state, keyboardType = "default" }) {
  return (
    <View className="py-2">
      <Text className="mb-1 text-sm font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400">{name}</Text>
      <TextInput
        value={value}
        onChangeText={state}
        keyboardType={keyboardType}
        accessibilityLabel={name}
        className="w-full px-3 py-3 text-base border rounded-2xl text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
      />
    </View>
  );
}
