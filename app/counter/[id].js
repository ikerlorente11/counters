import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Registry } from "../../components/Registry";
import { CustomLineChart } from "../../components/charts/linechart";
import { useCounter } from "../../lib/counterContext";
import { COUNTER_CHART_FILTERS, getCounterValuesForRange } from "../../lib/counterHistory";

import { getCountersValues } from "../../lib/db/database";

/**
 * Counter detail screen showing value history and trend chart.
 * @returns {JSX.Element}
 */
export default function CounterInfo() {
  const [range, setRange] = useState("7d");
  const [chartLabelDismissSignal, setChartLabelDismissSignal] = useState(0);
  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);
  const { setCounterId } = useCounter();

  useEffect(() => {
    setCounterId(id);
  }, [id, setCounterId]);

  const counterValues = getCountersValues(id);
  const latestValue = counterValues[counterValues.length - 1]?.value ?? 0;
  const filteredCounterValues = useMemo(() => getCounterValuesForRange(counterValues, range), [counterValues, range]);

  const data = filteredCounterValues.map((counter) => ({
    value: counter.value,
    dataPointText: `${counter.value}`,
    label: counter.date.substring(8,10) + "/" + counter.date.substring(5,7),
    fullLabel: counter.date.substring(8,10) + "/" + counter.date.substring(5,7) + "/" + counter.date.substring(2,4),
  }));

  return (
    <View
      className="flex-1 px-4 pb-4 bg-stone-100 dark:bg-stone-950"
      onTouchEnd={() => {
        setChartLabelDismissSignal((current) => current + 1);
      }}
    >
      <View className="flex-row justify-center pt-3 pb-3" style={{ gap: 8 }}>
        {COUNTER_CHART_FILTERS.map((filter) => {
          const isActive = range === filter.key;

          return (
            <Pressable
              key={filter.key}
              onPress={() => {
                setRange(filter.key);
              }}
              className={`px-4 py-2 rounded-2xl border ${
                isActive
                  ? "bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100"
                  : "bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700"
              }`}
              accessibilityRole="button"
              accessibilityLabel={`Show ${filter.label} chart range`}
            >
              <Text
                className={`text-sm font-black uppercase ${
                  isActive ? "text-stone-100 dark:text-stone-900" : "text-stone-700 dark:text-stone-200"
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        onTouchStart={(event) => {
          event.stopPropagation();
        }}
        onTouchEnd={(event) => {
          event.stopPropagation();
        }}
      >
        <CustomLineChart data={data} latestValue={latestValue} resetSignal={chartLabelDismissSignal} />
      </View>

      <View className="flex-1 min-h-0 mt-1">
        <Text className="mb-2 text-sm font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400">
          Registry
        </Text>
        <View className="flex-1 p-3 border rounded-3xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
          <FlatList
            data={counterValues}
            keyExtractor={(value) => value.id.toString()}
            renderItem={({ item }) => <Registry registry={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={(
              <View className="items-center justify-center py-8 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                <Text className="text-base font-semibold text-stone-700 dark:text-stone-200">
                  No values recorded yet.
                </Text>
              </View>
            )}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 0, flexGrow: counterValues.length === 0 ? 1 : 0 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          />
        </View>
      </View>
    </View>
  );
}
