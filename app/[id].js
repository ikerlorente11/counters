import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Form } from "../components/form/Form";
import { Button } from "../components/form/Button";
import { Registry } from "../components/Registry";
import { CustomLineChart } from "../components/charts/linechart";

import { getCountersValues } from "./db/database";

export default function CounterInfo() {
  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);

  const [showChart, setShowChart] = useState(false);

  const counterValues = getCountersValues(id);
  const data = counterValues.map((counter) => ({
    value: counter.value,
    label: counter.date,
    dataPointText: counter.value,
  }));

  return (
    <View className="h-full">
      <Form id={id} />
      <Text className="py-3 mt-3 text-2xl font-bold text-center border-t border-gray-400">
        Valores
      </Text>
      <View className="flex-row justify-center mb-2" style={{ gap: 10 }}>
        <Button
          text="Lista"
          textColor={"text-black"}
          color={showChart ? "bg-blue-300" : "bg-blue-200"}
          action={() => {
            setShowChart(false);
          }}
        />
        <Button
          text="Grafica"
          textColor={"text-black"}
          color={showChart ? "bg-blue-200" : "bg-blue-300"}
          action={() => {
            setShowChart(true);
          }}
        />
      </View>
      <View className="items-center flex-1">
        {showChart ? (
          <CustomLineChart data={data} />
        ) : (
          <FlatList
            data={counterValues}
            keyExtractor={(value) => value.id}
            renderItem={({ item }) => <Registry registry={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            className="w-full h-3 px-3 mb-3"
          />
        )}
      </View>
    </View>
  );
}
