import { View, Text, FlatList } from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Registry } from "../../components/Registry";
import { CustomLineChart } from "../../components/charts/linechart";
import { useCounter } from '../context';

import { getCountersValues } from "../db/database";

export default function CounterInfo() {
  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);
  const { setCounterId } = useCounter();

  useEffect(() => {
    setCounterId(id);
  }, [id, setCounterId]);

  const counterValues = getCountersValues(id);
  const data = counterValues.map((counter) => ({
    value: counter.value,
    label: counter.date.substring(0,6) + counter.date.substring(8,10),
    dataPointText: counter.value,
  }));

  return (
    <View className="h-full pb-3">
      <Text className="py-3 text-2xl font-bold text-center">
        Valores
      </Text>
      <CustomLineChart data={data} />
      <FlatList
        data={counterValues}
        keyExtractor={(value) => value.id}
        renderItem={({ item }) => <Registry registry={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        className="w-3/4 h-3 p-3 m-auto bg-blue-200 rounded-lg"
      />
    </View>
  );
}
