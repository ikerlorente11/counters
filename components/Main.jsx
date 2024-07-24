import { View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";

import { getCounters } from "../app/database";

export function Main() {
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    setCounters(
      getCounters().map((counter) => ({
        id: counter.id,
        title: counter.title,
        value: counter.value,
        color: counter.color,
        backgroundColor: counter.bgColor,
      }))
    );
  }, []);

  return (
    <View>
      <FlatList
        data={counters}
        keyExtractor={(counter) => counter.id}
        renderItem={({ item }) => <Counter counter={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        className="w-full px-3 mt-3"
      />
    </View>
  );
}
