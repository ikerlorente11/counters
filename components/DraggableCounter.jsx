import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Color from "color";
import { useColorScheme } from "nativewind";
import { playCounterTapFeedback, prepareCounterTapFeedback } from "../lib/counterFeedback";
import { updateCounterValue } from "../lib/db/database";
import { useI18n } from "../lib/i18n";
import { GRID_LAYOUT_MODE } from "../lib/layoutMode";
import { useCounter } from "../lib/counterContext";
import { UI_SCALE_OPTIONS } from "../lib/uiScale";
import { Plus, Minus } from "./Icons";

const DARK_BASE = "#0c0a09";
const LIGHT_BASE = "#ffffff";

function getAccentPalette(backgroundColor, isDarkMode) {
    try {
        const accent = Color(backgroundColor || "#6366f1");
        const base = Color(isDarkMode ? DARK_BASE : LIGHT_BASE);
        // Solid tinted card bg: blend accent into the theme base
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
 * Counter card with press actions and drag-and-drop reorder support.
 * @param {{
 * counter: {id: number, title: string, value: number | string, color: string, backgroundColor: string},
 * layoutMode?: "list" | "grid",
 * isDragging?: boolean,
 * shouldAnimateLayout?: boolean,
 * dragCompensation?: {x: number, y: number},
 * onDragStateChange?: (counterId: number, isDragging: boolean) => void,
 * onDragMove?: (counterId: number, dragData: {translationX: number, translationY: number}) => void,
 * onDrop?: (counterId: number, dragData: {translationX: number, translationY: number}) => void,
 * }} props
 * @returns {JSX.Element}
 */
export function DraggableCounter({
    counter,
    layoutMode = "list",
    isDragging = false,
    shouldAnimateLayout = false,
    dragCompensation = { x: 0, y: 0 },
    onDragStateChange,
    onDragMove,
    onDrop,
}) {
    const { t } = useI18n();
    const { colorScheme } = useColorScheme();
    const { uiScaleIndex } = useCounter();
    const scale = UI_SCALE_OPTIONS[uiScaleIndex] ?? 1;
    const scaledStyles = useMemo(() => ({
        counter: { minHeight: 96 * scale },
        title: { fontSize: 13 * scale },
        titleGrid: { fontSize: 12 * scale },
        value: { fontSize: 38 * scale, lineHeight: 44 * scale },
        valueGrid: { fontSize: 30 * scale, lineHeight: 36 * scale },
        button: { width: 52 * scale, height: 52 * scale, borderRadius: 26 * scale },
        buttonGrid: { height: 46 * scale, borderRadius: 23 * scale },
    }), [scale]);

    const [counterValue, setCounterValue] = useState(Number.parseInt(counter.value, 10) || 0);
    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);
    const entranceOpacity = useSharedValue(0);
    const entranceTranslate = useSharedValue(12);
    const dragScale = useSharedValue(1);
    const isGridLayout = layoutMode === GRID_LAYOUT_MODE;

    const isDarkMode = colorScheme === "dark";

    const { accentColor, buttonIconColor, cardBg, borderColor, shadowColor } = useMemo(
        () => getAccentPalette(counter.backgroundColor, isDarkMode),
        [counter.backgroundColor, isDarkMode],
    );

    const titleColor = isDarkMode ? "#a8a29e" : "#78716c";

    useEffect(() => {
        setCounterValue(Number.parseInt(counter.value, 10) || 0);
    }, [counter.value]);

    useEffect(() => {
        entranceOpacity.value = withTiming(1, { duration: 220 });
        entranceTranslate.value = withTiming(0, { duration: 220 });
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

    const dragGesture = Gesture.Pan()
        .activateAfterLongPress(320)
        .maxPointers(1)
        .onStart(() => {
            dragScale.value = withTiming(1.01, { duration: 90 });
            if (onDragStateChange) {
                runOnJS(onDragStateChange)(counter.id, true);
            }
        })
        .onUpdate((event) => {
            dragX.value = event.translationX;
            dragY.value = event.translationY;
            if (onDragMove) {
                runOnJS(onDragMove)(counter.id, {
                    translationX: event.translationX,
                    translationY: event.translationY,
                });
            }
        })
        .onEnd((event) => {
            if (onDrop) {
                runOnJS(onDrop)(counter.id, {
                    translationX: event.translationX,
                    translationY: event.translationY,
                });
            }
        })
        .onFinalize(() => {
            dragX.value = withTiming(0, { duration: 180 });
            dragY.value = withTiming(0, { duration: 180 });
            dragScale.value = withTiming(1, { duration: 180 });
            if (onDragStateChange) {
                runOnJS(onDragStateChange)(counter.id, false);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: entranceOpacity.value,
        transform: [
            { translateY: entranceTranslate.value + dragY.value + dragCompensation.y },
            { translateX: dragX.value + dragCompensation.x },
            { scale: dragScale.value },
        ],
        zIndex: isDragging ? 30 : 1,
    }));

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View
                layout={shouldAnimateLayout ? LinearTransition.duration(140) : undefined}
                style={[
                    styles.counterShadow,
                    {
                        backgroundColor: cardBg,
                        shadowColor: shadowColor,
                        shadowOpacity: isDragging
                            ? (isDarkMode ? 0.55 : 0.22)
                            : (isDarkMode ? 0.35 : 0.14),
                        shadowRadius: isDragging ? 24 : 14,
                        shadowOffset: { width: 0, height: isDragging ? 12 : 6 },
                        elevation: isDragging ? 16 : 8,
                    },
                    animatedStyle,
                ]}
            >
                <View
                    style={[
                        styles.counter,
                        isGridLayout ? styles.counterGrid : null,
                        isGridLayout ? null : scaledStyles.counter,
                        { borderColor: borderColor, backgroundColor: cardBg },
                    ]}
                >

                    {isGridLayout ? (
                        /* Grid layout: vertical with buttons at bottom */
                        <View style={styles.gridInner}>
                            <Link href={`/counter/${counter.id}`} asChild>
                                <Pressable style={styles.gridDataArea}>
                                    <Text
                                        style={[styles.title, scaledStyles.titleGrid, { color: titleColor }]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {counter.title}
                                    </Text>
                                    <Text style={[styles.value, scaledStyles.valueGrid, { color: accentColor }]}>
                                        {counterValue}
                                    </Text>
                                </Pressable>
                            </Link>
                            <View style={styles.buttonRowGrid}>
                                <Pressable
                                    onPress={handleDecrement}
                                    style={({ pressed }) => [
                                        styles.buttonGridHalf,
                                        scaledStyles.buttonGrid,
                                        { backgroundColor: accentColor },
                                        pressed ? styles.buttonPressed : null,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={t("counter.decrement", { title: counter.title })}
                                >
                                    <Minus color={buttonIconColor} size={20} />
                                </Pressable>
                                <Pressable
                                    onPress={handleIncrement}
                                    style={({ pressed }) => [
                                        styles.buttonGridHalf,
                                        scaledStyles.buttonGrid,
                                        { backgroundColor: accentColor },
                                        pressed ? styles.buttonPressed : null,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={t("counter.increment", { title: counter.title })}
                                >
                                    <Plus color={buttonIconColor} size={20} />
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        /* List layout: horizontal with buttons on sides */
                        <>
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
                                        ellipsizeMode="tail"
                                    >
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
                        </>
                    )}
                </View>
            </Animated.View>
        </GestureDetector>
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
    counterGrid: {
        minHeight: 0,
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    dataArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 80,
        paddingHorizontal: 8,
    },
    gridInner: {
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 14,
        paddingBottom: 14,
    },
    gridDataArea: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 68,
        marginBottom: 10,
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
    buttonRowGrid: {
        flexDirection: "row",
        gap: 10,
    },
    buttonGridHalf: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 23,
        overflow: "hidden",
    },
});
