import { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../app/db/database";
import { Plus, Minus } from "./Icons";
import Color from "color";

/**
 * Interactive counter card with increment/decrement actions.
 * @param {{counter: {id: number, title: string, value: number | string, color: string, backgroundColor: string}, playSound?: () => Promise<void>}} props
 * @returns {JSX.Element}
 */
export function Counter({ counter, playSound }) {
  const [counterValue, setCounterValue] = useState(
    Number.parseInt(counter.value, 10) || 0,
  );
  const bg_color = Color(counter.backgroundColor).desaturate(0.3).hex();

  const handleIncrement = () => {
    setCounterValue((previousValue) => {
      const nextValue = previousValue + 1;
      updateCounterValue({ id: counter.id, value: nextValue });
      void playSound?.();
      return nextValue;
    });
  };

  const handleDecrement = () => {
    setCounterValue((previousValue) => {
      const nextValue = previousValue - 1;
      updateCounterValue({ id: counter.id, value: nextValue });
      void playSound?.();
      return nextValue;
    });
  };

  return (
    <View
      style={[styles.counter, { borderColor: bg_color, borderWidth: 5 }]}
      key={counter.id}
    >
      <Pressable
        onPress={handleDecrement}
        style={[styles.button, { backgroundColor: bg_color }]}
        accessibilityRole="button"
        accessibilityLabel={`Decrement ${counter.title}`}
      >
        <Minus color={counter.color} size={40} />
      </Pressable>
      <View style={styles.data} className="w-3/5">
        <Link href={`/counter/${counter.id}`} asChild>
          <Pressable style={styles.data}>
            <Text
              style={[styles.title, { color: "white" }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {counter.title}
            </Text>
            <Text style={[styles.value, { color: "white" }]}>
              {counterValue}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable
        onPress={handleIncrement}
        style={[styles.button, { backgroundColor: bg_color }]}
        accessibilityRole="button"
        accessibilityLabel={`Increment ${counter.title}`}
      >
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
    borderRadius: 17,
    height: 100,
    backgroundColor: "#00000050",
  },
  data: {
    alignItems: "center",
    width: "60%",
  },
  title: {
    fontSize: 20,
    userSelect: "none",
    textAlign: "center",
    width: "160%",
  },
  value: {
    fontSize: 40,
    userSelect: "none",
    textAlign: "center",
    width: "160%",
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
