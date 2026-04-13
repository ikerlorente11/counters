import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../lib/db/database";
import { useI18n } from "../lib/i18n";
import { Plus, Minus } from "./Icons";
import Color from "color";

/**
 * Builds safe accent and card colors even when persisted values are malformed.
 * @param {string | null | undefined} backgroundColor
 * @returns {{accentColor: string, cardColor: string}}
 */
function getSafeCardPalette(backgroundColor) {
  try {
    const base = Color(backgroundColor || "#111827");
    return {
      accentColor: base.desaturate(0.3).hex(),
      cardColor: base.desaturate(0.7).lighten(0.4).hex(),
    };
  } catch {
    return {
      accentColor: "#1f2937",
      cardColor: "#374151",
    };
  }
}

/**
 * Interactive counter card with increment/decrement actions.
 * @param {{counter: {id: number, title: string, value: number | string, color: string, backgroundColor: string}, playSound?: () => Promise<void>}} props
 * @returns {JSX.Element}
 */
export function Counter({ counter, playSound }) {
  const { t } = useI18n();
  const [counterValue, setCounterValue] = useState(
    Number.parseInt(counter.value, 10) || 0,
  );
  const [isPressed, setIsPressed] = useState(false);
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslate = useRef(new Animated.Value(10)).current;
  const { accentColor, cardColor } = getSafeCardPalette(counter.backgroundColor);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(entranceTranslate, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [entranceOpacity, entranceTranslate]);

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
    <Animated.View
      style={[
        styles.counter,
        {
          borderColor: accentColor,
          backgroundColor: cardColor,
          opacity: entranceOpacity,
          transform: [
            { translateY: entranceTranslate },
            { scale: isPressed ? 0.992 : 1 },
          ],
        },
      ]}
      key={counter.id}
    >
      <Pressable
        onPress={handleDecrement}
        onPressIn={() => {
          setIsPressed(true);
        }}
        onPressOut={() => {
          setIsPressed(false);
        }}
        style={[styles.button, { backgroundColor: accentColor }]}
        accessibilityRole="button"
        accessibilityLabel={t("counter.decrement", { title: counter.title })}
      >
        <Minus color={counter.color} size={22} />
      </Pressable>
      <View style={styles.data} className="w-3/5">
        <Link href={`/counter/${counter.id}`} asChild>
          <Pressable style={styles.data}>
            <Text
              style={[styles.title, { color: counter.color }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {counter.title}
            </Text>
            <Text style={[styles.value, { color: counter.color }]}>
              {counterValue}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Pressable
        onPress={handleIncrement}
        onPressIn={() => {
          setIsPressed(true);
        }}
        onPressOut={() => {
          setIsPressed(false);
        }}
        style={[styles.button, { backgroundColor: accentColor }]}
        accessibilityRole="button"
        accessibilityLabel={t("counter.increment", { title: counter.title })}
      >
        <Plus color={counter.color} size={22} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 106,
    paddingHorizontal: 8,
  },
  data: {
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    minHeight: 92,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    userSelect: "none",
    textAlign: "center",
    width: "100%",
  },
  value: {
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 42,
    userSelect: "none",
    textAlign: "center",
    width: "100%",
  },
  button: {
    width: 54,
    borderRadius: 16,
    alignItems: "center",
    height: 88,
    justifyContent: "center",
  },
});
