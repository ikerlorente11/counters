import { StyleSheet, View, FlatList } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Counter } from "./Counter";
import { Topbar } from "./Topbar";

export function Main() {
  const insets = useSafeAreaInsets();
  const [counters, setCounters] = useState([
    {
      id: 1,
      title: "counter1",
      value: 0,
      color: "white",
      backgroundColor: "blue",
    },
    {
      id: 2,
      title: "counter2",
      value: 1,
      color: "white",
      backgroundColor: "red",
    },
    {
      id: 3,
      title: "counter3",
      value: 2,
      color: "white",
      backgroundColor: "green",
    },
    {
      id: 4,
      title: "counter4",
      value: 3,
      color: "white",
      backgroundColor: "brown",
    },
    {
      id: 5,
      title: "counter5",
      value: 4,
      color: "white",
      backgroundColor: "grey",
    },
    {
      id: 6,
      title: "counter6",
      value: 5,
      color: "white",
      backgroundColor: "black",
    },
    {
      id: 7,
      title: "counter7",
      value: 6,
      color: "black",
      backgroundColor: "yellow",
    },
    {
      id: 8,
      title: "counter8",
      value: 7,
      color: "black",
      backgroundColor: "pink",
    },
    {
      id: 9,
      title: "counter9",
      value: 8,
      color: "black",
      backgroundColor: "orange",
    },
    {
      id: 10,
      title: "counter10",
      value: 9,
      color: "white",
      backgroundColor: "purple",
    },
  ]);

  const add = ({ title }) => {
    setCounters((counters) => [
      ...counters,
      {
        id: counters.length + 1,
        title: title,
        value: counters.length,
        color: "white",
        backgroundColor: "magenta",
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Topbar />
      <FlatList
        data={counters}
        keyExtractor={(counter) => counter.id}
        renderItem={({ item, index }) => <Counter counter={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  list: {
    marginBottom: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
});
