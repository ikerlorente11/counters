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
import {
    playCounterTapFeedback,
    prepareCounterTapFeedback,
} from "../lib/counterFeedback";
import { updateCounterValue } from "../lib/db/database";
import { useI18n } from "../lib/i18n";
import { GRID_LAYOUT_MODE } from "../lib/layoutMode";
import { useCounter } from "../lib/counterContext";
import { UI_SCALE_OPTIONS } from "../lib/uiScale";
import { Plus, Minus } from "./Icons";

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
    const { uiScaleIndex } = useCounter();
    const scale = UI_SCALE_OPTIONS[uiScaleIndex] ?? 1;
    const scaledStyles = useMemo(() => ({
        counter: { minHeight: 106 * scale },
        title: { fontSize: 16 * scale },
        titleGrid: { fontSize: 15 * scale },
        value: { fontSize: 38 * scale, lineHeight: 42 * scale },
        valueGrid: { fontSize: 32 * scale, lineHeight: 36 * scale },
        button: { width: 68 * scale, height: 88 * scale },
    }), [scale]);
    const [counterValue, setCounterValue] = useState(Number.parseInt(counter.value, 10) || 0);
    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);
    const entranceOpacity = useSharedValue(0);
    const entranceTranslate = useSharedValue(10);
    const dragScale = useSharedValue(1);
    const isGridLayout = layoutMode === GRID_LAYOUT_MODE;
    const { accentColor, cardColor } = useMemo(
        () => getSafeCardPalette(counter.backgroundColor),
        [counter.backgroundColor],
    );

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

    const handleTapFeedback = () => {
        void playCounterTapFeedback();
    };

    const handleIncrement = () => {
        handleValueChange(1);
    };

    const handleDecrement = () => {
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
                    styles.counter,
                    isGridLayout ? styles.counterGrid : null,
                    isGridLayout ? null : scaledStyles.counter,
                    {
                        borderColor: accentColor,
                        backgroundColor: cardColor,
                        shadowColor: "#000000",
                        shadowOpacity: isDragging ? 0.18 : 0.08,
                        shadowRadius: isDragging ? 18 : 10,
                        shadowOffset: { width: 0, height: isDragging ? 12 : 6 },
                        elevation: isDragging ? 10 : 2,
                    },
                    animatedStyle,
                ]}
            >
                {isGridLayout ? null : (
                    <Pressable
                        onPressIn={handleTapFeedback}
                        onPress={handleDecrement}
                        style={({ pressed }) => [
                            styles.button,
                            scaledStyles.button,
                            pressed ? styles.buttonPressed : null,
                            { backgroundColor: accentColor },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t("counter.decrement", { title: counter.title })}
                    >
                        <Minus color={counter.color} size={22} />
                    </Pressable>
                )}

                <View style={isGridLayout ? styles.dataGridShell : styles.dataShell}>
                    <Link href={`/counter/${counter.id}`} asChild>
                        <Pressable style={[styles.data, isGridLayout ? styles.dataGrid : null]}>
                            <Text
                                style={[styles.title, scaledStyles.title, isGridLayout ? scaledStyles.titleGrid : null, { color: counter.color }]}
                                numberOfLines={isGridLayout ? 2 : 1}
                                ellipsizeMode="tail"
                            >
                                {counter.title}
                            </Text>
                            <Text style={[styles.value, scaledStyles.value, isGridLayout ? scaledStyles.valueGrid : null, { color: counter.color }]}>
                                {counterValue}
                            </Text>
                        </Pressable>
                    </Link>
                    {isGridLayout ? (
                        <View style={styles.buttonRowGrid}>
                            <Pressable
                                onPressIn={handleTapFeedback}
                                onPress={handleDecrement}
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.buttonGridHalf,
                                    pressed ? styles.buttonPressed : null,
                                    { backgroundColor: accentColor },
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={t("counter.decrement", { title: counter.title })}
                            >
                                <Minus color={counter.color} size={22} />
                            </Pressable>
                            <Pressable
                                onPressIn={handleTapFeedback}
                                onPress={handleIncrement}
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.buttonGridHalf,
                                    pressed ? styles.buttonPressed : null,
                                    { backgroundColor: accentColor },
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={t("counter.increment", { title: counter.title })}
                            >
                                <Plus color={counter.color} size={22} />
                            </Pressable>
                        </View>
                    ) : null}
                </View>

                {isGridLayout ? null : (
                    <Pressable
                        onPressIn={handleTapFeedback}
                        onPress={handleIncrement}
                        style={({ pressed }) => [
                            styles.button,
                            scaledStyles.button,
                            pressed ? styles.buttonPressed : null,
                            { backgroundColor: accentColor },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t("counter.increment", { title: counter.title })}
                    >
                        <Plus color={counter.color} size={22} />
                    </Pressable>
                )}
            </Animated.View>
        </GestureDetector>
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
    counterGrid: {
        minHeight: 0,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    dataShell: {
        flex: 1,
    },
    dataGridShell: {
        width: "100%",
    },
    data: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 92,
    },
    dataGrid: {
        minHeight: 72,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        userSelect: "none",
        textAlign: "center",
        width: "100%",
    },
    titleGrid: {
        fontSize: 15,
    },
    value: {
        fontSize: 38,
        fontWeight: "900",
        lineHeight: 42,
        userSelect: "none",
        textAlign: "center",
        width: "100%",
    },
    valueGrid: {
        fontSize: 32,
        lineHeight: 36,
    },
    button: {
        width: 68,
        borderRadius: 16,
        alignItems: "center",
        height: 88,
        justifyContent: "center",
    },
    buttonPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.94 }],
    },
    buttonGrid: {
        width: "100%",
        height: 42,
        borderRadius: 14,
    },
    buttonRowGrid: {
        flexDirection: "row",
        gap: 10,
        marginTop: 12,
    },
    buttonGridHalf: {
        flex: 1,
        height: 52,
        borderRadius: 14,
    },
});
