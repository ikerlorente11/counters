import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

export function Counter({ counter }) {
  const [counterValue, setCounterValue] = useState(parseInt(counter.value));

  const up = () => {
    setCounterValue(counterValue + 1);
  };
  const down = () => {
    setCounterValue(counterValue - 1);
  };

  return (
    <View
      style={[styles.counter, { backgroundColor: counter.backgroundColor }]}
      key={counter.id}
    >
      <Pressable onPress={down} style={styles.button}>
        <Text style={[styles.buttonText, { color: counter.color }]}>-</Text>
      </Pressable>
      <View style={styles.data}>
        <Text style={[styles.title, { color: counter.color }]}>
          {counter.title}
        </Text>
        <Text style={[styles.value, { color: counter.color }]}>
          {counterValue}
        </Text>
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
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, .3)",
    padding: 3,
    width: "50%",
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
