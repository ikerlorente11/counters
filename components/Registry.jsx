import { View, Text } from "react-native";

/**
 * Renders one historical value row.
 * @param {{registry: {date: string, value: number}}} props
 * @returns {JSX.Element}
 */
export function Registry({ registry }) {
  return (
    <View className="flex-row items-center justify-around py-2 border rounded-2xl border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
      <Text className="w-1/2 text-base font-semibold text-center border-r text-stone-700 dark:text-stone-100 border-stone-300 dark:border-stone-600">
        {registry.date.substring(8, 10) + "/" + registry.date.substring(5, 7) + "/" + registry.date.substring(0, 4)}
      </Text>
      <Text className="w-1/2 text-2xl font-black text-center text-stone-900 dark:text-stone-100">{registry.value}</Text>
    </View>
  );
}
