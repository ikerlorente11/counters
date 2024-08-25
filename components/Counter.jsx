import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../app/db/database";
import { Plus, Minus } from "./Icons";
import Color from "color";

export function Counter({ counter, playSound }) {
  const [counterValue, setCounterValue] = useState(parseInt(counter.value));
  const bg_color = Color(counter.backgroundColor).desaturate(0.3).hex();

  const up = () => {
    // playSound();
    setCounterValue(counterValue + 1);
    updateCounterValue({ id: counter.id, value: counterValue + 1 });
  };
  const down = () => {
    // playSound();
    setCounterValue(counterValue - 1);
    updateCounterValue({ id: counter.id, value: counterValue - 1 });
  };

  return (
    <View
      style={[styles.counter, { borderColor: bg_color, borderWidth: 5 }]}
      key={counter.id}
    >
      <Pressable onPress={down} style={[styles.button, { backgroundColor: bg_color }]}>
        <Minus color={counter.color} size={40} />
      </Pressable>
      <View style={styles.data} className="w-3/5">
        <Link href={`/counter/${counter.id}`} asChild>
          <Pressable style={styles.data} className="w-full">
            <Text style={[styles.title, { color: "white" }]}>
              {counter.title}
            </Text>
            <Text style={[styles.value, { color: "white" }]}>
              {counterValue}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={up} style={[styles.button, { backgroundColor: bg_color }]}>
        <Plus color={counter.color} size={40} />
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
    borderRadius: 17,
    height: 100,
    backgroundColor: "#00000050",
  },
  data: {
    display: "flex",
    alignItems: "center",
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
    height: "100%",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 50,
    userSelect: "none",
  },
});
