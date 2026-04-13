import { View, Text } from "react-native";
import { useI18n } from "../lib/i18n";

/**
 * Renders one historical value row.
 * @param {{registry: {date: string, value: number}}} props
 * @returns {JSX.Element}
 */
export function Registry({ registry }) {
  const { formatDate } = useI18n();

  return (
    <View className="flex-row items-center justify-around py-2 border rounded-2xl border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
      <Text className="w-1/2 text-base font-semibold text-center border-r text-stone-700 dark:text-stone-100 border-stone-300 dark:border-stone-600">
        {formatDate(registry.date, { year: "numeric", month: "2-digit", day: "2-digit" })}
      </Text>
      <Text className="w-1/2 text-2xl font-black text-center text-stone-900 dark:text-stone-100">{registry.value}</Text>
    </View>
  );
}
