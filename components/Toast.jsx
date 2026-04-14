import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
    LinearTransition,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Toast component displaying a temporary notification with animation.
 * Automatically dismisses after specified duration.
 */
export function Toast({
    id,
    type = "info", // "success", "error", "info"
    title,
    message,
    duration = 2200,
    onDismiss,
    colorScheme,
}) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-80);

    // Determine colors based on type and theme
    const getColors = () => {
        const isDark = colorScheme === "dark";
        const colors = {
            success: {
                bg: isDark ? "rgb(30, 41, 59)" : "rgb(239, 246, 246)",
                border: isDark ? "rgb(15, 101, 97)" : "rgb(167, 243, 208)",
                text: isDark ? "rgb(167, 243, 208)" : "rgb(11, 83, 79)",
                icon: isDark ? "rgb(167, 243, 208)" : "rgb(11, 83, 79)",
            },
            error: {
                bg: isDark ? "rgb(41, 32, 32)" : "rgb(254, 241, 242)",
                border: isDark ? "rgb(127, 29, 29)" : "rgb(248, 113, 113)",
                text: isDark ? "rgb(248, 113, 113)" : "rgb(127, 29, 29)",
                icon: isDark ? "rgb(248, 113, 113)" : "rgb(127, 29, 29)",
            },
            info: {
                bg: isDark ? "rgb(30, 39, 46)" : "rgb(240, 249, 255)",
                border: isDark ? "rgb(7, 89, 133)" : "rgb(96, 204, 245)",
                text: isDark ? "rgb(96, 204, 245)" : "rgb(7, 89, 133)",
                icon: isDark ? "rgb(96, 204, 245)" : "rgb(7, 89, 133)",
            },
        };
        return colors[type] || colors.info;
    };

    const colors = getColors();

    const getIcon = () => {
        switch (type) {
            case "success":
                return "check-circle";
            case "error":
                return "alert-circle";
            default:
                return "information";
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        let removeTimer;

        opacity.value = withTiming(1, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
        });
        translateY.value = withTiming(0, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
        });

        const dismissTimer = setTimeout(() => {
            opacity.value = withTiming(0, {
                duration: 180,
                easing: Easing.in(Easing.cubic),
            });
            translateY.value = withTiming(-80, {
                duration: 180,
                easing: Easing.in(Easing.cubic),
            });

            removeTimer = setTimeout(() => {
                runOnJS(onDismiss)(id);
            }, 180);
        }, duration);

        return () => {
            clearTimeout(dismissTimer);
            clearTimeout(removeTimer);
        };
    }, [duration, id, onDismiss, opacity, translateY]);

    return (
        <Animated.View
            layout={LinearTransition.springify().damping(20).stiffness(220)}
            style={[
                {
                    marginBottom: 12,
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 18,
                    borderLeftWidth: 4,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingVertical: 12,
                    backgroundColor: colors.bg,
                    borderLeftColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    shadowColor: "#000000",
                    shadowOpacity: 0.12,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 8,
                },
                animatedStyle,
            ]}
        >
            <MaterialCommunityIcons
                name={getIcon()}
                size={20}
                color={colors.icon}
            />
            <View style={{ flex: 1 }}>
                {title && (
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: colors.text,
                            marginBottom: 2,
                            flexShrink: 1,
                        }}
                    >
                        {title}
                    </Text>
                )}
                {message && (
                    <Text
                        style={{
                            fontSize: 13,
                            color: colors.text,
                            opacity: 0.9,
                            flexShrink: 1,
                        }}
                    >
                        {message}
                    </Text>
                )}
            </View>
            <Pressable
                onPress={() => onDismiss(id)}
                style={{ padding: 4 }}
            >
                <MaterialCommunityIcons
                    name="close"
                    size={16}
                    color={colors.icon}
                    style={{ opacity: 0.6 }}
                />
            </Pressable>
        </Animated.View>
    );
}
