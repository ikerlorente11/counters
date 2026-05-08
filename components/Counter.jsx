import { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { Link } from "expo-router";
import { updateCounterValue } from "../lib/db/database";
import {
  playCounterTapFeedback,
  prepareCounterTapFeedback,
} from "../lib/counterFeedback";
import { useI18n } from "../lib/i18n";
import { Plus, Minus } from "./Icons";
import Color from "color";
import { LinearGradient } from "expo-linear-gradient";
import { useCounter } from "../lib/counterContext";
import { UI_SCALE_OPTIONS } from "../lib/uiScale";

/**
 * Builds safe accent and card colors even when persisted values are malformed.
 * @param {string | null | undefined} backgroundColor
 * @returns {{accentColor: string, cardColor: string}}
 */
function getSafeCardPalette(backgroundColor) {
  try {
    const base = Color(backgroundColor || "#111827");
    const card = base.desaturate(0.6).lighten(0.4);
    const cardL = card.lightness();
    const accent = base.desaturate(0.3);
    const accentL = accent.lightness();
    const isDark = card.isDark();
    return {
      accentColor: accent.hex(),
      gradientColors: [
        card.lightness(Math.min(cardL + 22, 94)).hex(),
        card.hex(),
        card.lightness(Math.max(cardL - 14, 2)).hex(),
      ],
      buttonGradientColors: [
        accent.lightness(Math.min(accentL + 18, 85)).hex(),
        accent.hex(),
        accent.lightness(Math.max(accentL - 14, 3)).hex(),
      ],
      borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.10)",
      shadowColor: isDark
        ? base.lightness(55).saturate(0.3).hex()
        : "#000000",
      shadowOpacity: isDark ? 0.65 : 0.22,
    };
  } catch {
    return {
      accentColor: "#1f2937",
      gradientColors: ["#4b5563", "#374151", "#1a2233"],
      buttonGradientColors: ["#4b5563", "#374151", "#1a2233"],
      borderColor: "rgba(255,255,255,0.12)",
      shadowColor: "#000000",
      shadowOpacity: 0.25,
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
  const { uiScaleIndex } = useCounter();
  const scale = UI_SCALE_OPTIONS[uiScaleIndex] ?? 1;
  const scaledStyles = useMemo(() => ({
    counter: { minHeight: 106 * scale },
    title: { fontSize: 16 * scale },
    value: { fontSize: 38 * scale, lineHeight: 42 * scale },
    button: { width: 54 * scale, height: 88 * scale },
  }), [scale]);
  const [counterValue, setCounterValue] = useState(
    Number.parseInt(counter.value, 10) || 0,
  );
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslate = useRef(new Animated.Value(10)).current;
  const { accentColor, gradientColors, buttonGradientColors, borderColor, shadowColor, shadowOpacity } = getSafeCardPalette(counter.backgroundColor);

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

  const handleTapFeedback = () => {
    void playCounterTapFeedback();
  };

  const handleIncrement = () => {
    handleValueChange(1);
  };

  const handleDecrement = () => {
    handleValueChange(-1);
  };

  return (
    <Animated.View
      style={[
        styles.counterShadow,
        {
          backgroundColor: gradientColors[1],
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 9 },
          shadowOpacity: shadowOpacity,
          shadowRadius: 18,
          elevation: 12,
          opacity: entranceOpacity,
          transform: [{ translateY: entranceTranslate }],
        },
      ]}
      key={counter.id}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.counter, scaledStyles.counter, { borderColor: borderColor }]}
      >
        <Pressable
          onPressIn={handleTapFeedback}
          onPress={handleDecrement}
          style={({ pressed }) => [
            styles.button,
            scaledStyles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("counter.decrement", { title: counter.title })}
        >
          <LinearGradient
            colors={buttonGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.buttonGradientFill}
          />
          <Minus color={counter.color} size={22} />
        </Pressable>
        <View style={styles.data} className="w-3/5">
          <Link href={`/counter/${counter.id}`} asChild>
            <Pressable style={styles.data}>
              <Text
                style={[styles.title, scaledStyles.title, { color: counter.color }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {counter.title}
              </Text>
              <Text style={[styles.value, scaledStyles.value, { color: counter.color }]}>
                {counterValue}
              </Text>
            </Pressable>
          </Link>
        </View>
        <Pressable
          onPressIn={handleTapFeedback}
          onPress={handleIncrement}
          style={({ pressed }) => [
            styles.button,
            scaledStyles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("counter.increment", { title: counter.title })}
        >
          <LinearGradient
            colors={buttonGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.buttonGradientFill}
          />
          <Plus color={counter.color} size={22} />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  counterShadow: {
    borderRadius: 24,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1.5,
    minHeight: 106,
    paddingHorizontal: 8,
    overflow: "hidden",
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
    overflow: "hidden",
  },
  buttonGradientFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  buttonPressed: {
    opacity: 0.80,
    transform: [{ scale: 0.93 }],
  },
});
