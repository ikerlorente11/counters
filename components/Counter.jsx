import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../lib/db/database";
import { playCounterTapFeedback, prepareCounterTapFeedback } from "../lib/counterFeedback";
import { useI18n } from "../lib/i18n";
import { Plus, Minus } from "./Icons";
import Color from "color";
import { useColorScheme } from "nativewind";
import { useCounter } from "../lib/counterContext";
import { UI_SCALE_OPTIONS } from "../lib/uiScale";

const DARK_BASE = "#0c0a09";
const LIGHT_BASE = "#ffffff";

function getAccentPalette(backgroundColor, isDarkMode) {
  try {
    const accent = Color(backgroundColor || "#6366f1");
    const base = Color(isDarkMode ? DARK_BASE : LIGHT_BASE);
    const cardBg = accent.mix(base, isDarkMode ? 0.85 : 0.92).hex();
    const borderAlpha = isDarkMode ? 0.50 : 0.30;
    const borderColor = accent.alpha(borderAlpha).rgb().string();
    return {
      accentColor: accent.hex(),
      buttonIconColor: accent.isDark() ? "#ffffff" : "#1a1a1a",
      cardBg,
      borderColor,
      shadowColor: accent.hex(),
    };
  } catch {
    return {
      accentColor: "#6366f1",
      buttonIconColor: "#ffffff",
      cardBg: isDarkMode ? "#1a1a2e" : "#f5f5ff",
      borderColor: "rgba(99,102,241,0.35)",
      shadowColor: "#6366f1",
    };
  }
}

/**
 * Interactive counter card with increment/decrement actions.
 * @param {{counter: {id: number, title: string, value: number | string, color: string, backgroundColor: string}}} props
 * @returns {JSX.Element}
 */
export function Counter({ counter }) {
  const { t } = useI18n();
  const { colorScheme } = useColorScheme();
  const { uiScaleIndex } = useCounter();
  const scale = UI_SCALE_OPTIONS[uiScaleIndex] ?? 1;
  const scaledStyles = useMemo(() => ({
    counter: { minHeight: 96 * scale },
    title: { fontSize: 13 * scale },
    value: { fontSize: 38 * scale, lineHeight: 44 * scale },
    button: { width: 52 * scale, height: 52 * scale, borderRadius: 26 * scale },
  }), [scale]);

  const [counterValue, setCounterValue] = useState(
    Number.parseInt(counter.value, 10) || 0,
  );
  const entranceOpacity = useMemo(() => new Animated.Value(0), []);
  const entranceTranslate = useMemo(() => new Animated.Value(12), []);

  const isDarkMode = colorScheme === "dark";

  const { accentColor, buttonIconColor, cardBg, borderColor, shadowColor } = useMemo(
    () => getAccentPalette(counter.backgroundColor, isDarkMode),
    [counter.backgroundColor, isDarkMode],
  );

  const titleColor = isDarkMode ? "#a8a29e" : "#78716c";

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

  useEffect(() => {
    void prepareCounterTapFeedback();
  }, []);

  const handleValueChange = (delta) => {
    setCounterValue((previousValue) => {
      const nextValue = previousValue + delta;
      updateCounterValue({ id: counter.id, value: nextValue });
      return nextValue;
    });
  };

  const handleIncrement = () => {
    void playCounterTapFeedback();
    handleValueChange(1);
  };

  const handleDecrement = () => {
    void playCounterTapFeedback();
    handleValueChange(-1);
  };

  return (
    <Animated.View
      style={[
        styles.counterShadow,
        {
          backgroundColor: cardBg,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkMode ? 0.35 : 0.14,
          shadowRadius: 14,
          elevation: 8,
          opacity: entranceOpacity,
          transform: [{ translateY: entranceTranslate }],
        },
      ]}
      key={counter.id}
    >
      <View
        style={[
          styles.counter,
          scaledStyles.counter,
          { borderColor: borderColor, backgroundColor: cardBg },
        ]}
      >

        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [
            styles.button,
            scaledStyles.button,
            { backgroundColor: accentColor },
            pressed ? styles.buttonPressed : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("counter.decrement", { title: counter.title })}
        >
          <Minus color={buttonIconColor} size={22} />
        </Pressable>

        <Link href={`/counter/${counter.id}`} asChild>
          <Pressable style={styles.dataArea}>
            <Text
              style={[styles.title, scaledStyles.title, { color: titleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {counter.title}
            </Text>
            <Text style={[styles.value, scaledStyles.value, { color: accentColor }]}>
              {counterValue}
            </Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [
            styles.button,
            scaledStyles.button,
            { backgroundColor: accentColor },
            pressed ? styles.buttonPressed : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("counter.increment", { title: counter.title })}
        >
          <Plus color={buttonIconColor} size={22} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  counterShadow: {
    borderRadius: 22,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1.5,
    minHeight: 96,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  dataArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    userSelect: "none",
    textAlign: "center",
    width: "100%",
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 44,
    userSelect: "none",
    textAlign: "center",
    width: "100%",
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.91 }],
  },
});
