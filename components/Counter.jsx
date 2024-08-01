import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../app/db/database";

export function Counter({ counter }) {
  const [counterValue, setCounterValue] = useState(parseInt(counter.value));

  const up = () => {
    setCounterValue(counterValue + 1);
    updateCounterValue({ id: counter.id, value: counterValue + 1 });
  };
  const down = () => {
    setCounterValue(counterValue - 1);
    updateCounterValue({ id: counter.id, value: counterValue - 1 });
  };

  return (
    <View
      style={[styles.counter, { backgroundColor: counter.backgroundColor }]}
      key={counter.id}
    >
      <Pressable onPress={down} style={styles.button}>
        <Text style={[styles.buttonText, { color: counter.color }]}>-</Text>
      </Pressable>
      <View style={styles.data} className="w-3/5">
        <Link href={`/counter/${counter.id}`} asChild>
          <Pressable style={styles.data} className="w-full">
            <Text style={[styles.title, { color: counter.color }]}>
              {counter.title}
            </Text>
            <Text style={[styles.value, { color: counter.color }]}>
              {counterValue}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={up} style={styles.button}>
        <Text style={[styles.buttonText, { color: counter.color }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    padding: 10,
    borderRadius: 17,
  },
  data: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    userSelect: "none",
  },
  value: {
    fontSize: 40,
    userSelect: "none",
  },
  button: {
    padding: 5,
    width: "20%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 50,
    userSelect: "none",
  },
});
