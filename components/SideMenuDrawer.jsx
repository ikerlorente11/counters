import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SUPPORTED_LANGUAGES } from "../lib/i18n";
import { UI_SCALE_LABELS, UI_SCALE_OPTIONS } from "../lib/uiScale";

/**
 * Side drawer with all global app options.
 * @param {{
 * isOpen: boolean,
 * onClose: () => void,
 * insets: { top: number, bottom: number },
 * t: (key: string, params?: Record<string, unknown>) => string,
 * colorScheme: "light" | "dark",
 * iconColor: string,
 * language: "en" | "es",
 * onGoHome: () => void,
 * onToggleLayout: () => void,
 * onToggleTheme: () => void,
 * onToggleNotifications: () => void,
 * onAdjustNotificationHour: (delta: number) => void,
 * onAdjustNotificationMinute: (delta: number) => void,
 * onSaveNotifications: () => void,
 * onTapSoundVolumeChange: (value: number) => void,
 * onTapSoundVolumeComplete: (value: number) => void,
 * onVibrationStrengthChange: (value: number) => void,
 * onVibrationStrengthComplete: (value: number) => void,
 * onSelectLanguage: (nextLanguage: "en" | "es") => void,
 * onShowReport: () => void,
 * onResetAll: () => void,
 * nextLayoutLabel: string,
 * layoutMode: "list" | "grid",
 * uiScaleIndex: number,
 * onUiScaleChange: (index: number) => void,
 * notificationsEnabled: boolean,
 * notificationHour: number,
 * notificationMinute: number,
 * tapSoundVolume: number,
 * vibrationStrength: number,
 * }} props
 * @returns {JSX.Element | null}
 */
export function SideMenuDrawer(props) {
    const {
        isOpen,
        onClose,
        insets,
        t,
        colorScheme,
        iconColor,
        language,
        onGoHome,
        onToggleLayout,
        onToggleTheme,
        onToggleNotifications,
        onAdjustNotificationHour,
        onAdjustNotificationMinute,
        onSaveNotifications,
        onTapSoundVolumeChange,
        onTapSoundVolumeComplete,
        onVibrationStrengthChange,
        onVibrationStrengthComplete,
        onSelectLanguage,
        onShowReport,
        onResetAll,
        nextLayoutLabel,
        layoutMode,
        uiScaleIndex,
        onUiScaleChange,
        notificationsEnabled,
        notificationHour,
        notificationMinute,
        tapSoundVolume,
        vibrationStrength,
    } = props;

    const { width: windowWidth } = useWindowDimensions();
    const [isMounted, setIsMounted] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const drawerWidth = useMemo(() => Math.min(340, Math.max(276, Math.floor(windowWidth * 0.84))), [windowWidth]);
    const drawerOffset = useRef(new Animated.Value(-340)).current;

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            drawerOffset.setValue(-drawerWidth);
            Animated.timing(drawerOffset, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start();
            return;
        }

        if (!isMounted) {
            return;
        }

        Animated.timing(drawerOffset, {
            toValue: -drawerWidth,
            duration: 200,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                setIsMounted(false);
                setIsLanguageOpen(false);
            }
        });
    }, [drawerOffset, drawerWidth, isMounted, isOpen]);

    if (!isMounted) {
        return null;
    }

    const sectionTitleColor = colorScheme === "dark" ? "#a8a29e" : "#57534e";
    const scale = UI_SCALE_OPTIONS[uiScaleIndex] ?? 1;
    const sc = (n) => Math.round(n * scale);

    return (
        <Modal
            visible={isMounted}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.root}>
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel={t("form.close")}
                />

                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            width: drawerWidth,
                            transform: [{ translateX: drawerOffset }],
                            paddingTop: Math.max(insets.top, 10),
                            paddingBottom: Math.max(insets.bottom, 10),
                        },
                    ]}
                    className="border-r border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                    accessibilityViewIsModal
                >
                    <View
                        className="flex-row items-center justify-between px-3 border-b border-stone-300 dark:border-stone-700"
                        style={{ paddingTop: 4, paddingBottom: 4 }}
                    >
                        <Text className="text-2xl font-black text-stone-900 dark:text-stone-100" style={{ fontSize: sc(24) }}>{t("topbar.menuTitle")}</Text>
                        <Pressable
                            onPress={onClose}
                            className="items-center justify-center w-10 h-10 rounded-2xl bg-stone-200 dark:bg-stone-800"
                            accessibilityRole="button"
                            accessibilityLabel={t("form.close")}
                        >
                            <MaterialCommunityIcons name="close" size={sc(22)} color={iconColor} />
                        </Pressable>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 8, paddingBottom: 68, gap: 10 }}
                    >
                        <View style={{ gap: 7 }}>
                            <View className="flex-row items-center" style={{ gap: 8 }}>
                                <CompactActionButton
                                    icon="home-outline"
                                    label={t("topbar.home")}
                                    iconColor={iconColor}
                                    onPress={onGoHome}
                                    grow
                                    scale={scale}
                                />
                                <CompactActionButton
                                    icon={layoutMode === "grid" ? "view-agenda-outline" : "view-grid-outline"}
                                    label={nextLayoutLabel}
                                    iconColor={iconColor}
                                    onPress={onToggleLayout}
                                    grow
                                    scale={scale}
                                />
                            </View>
                            <View className="flex-row items-center" style={{ gap: 8 }}>
                                <CompactActionButton
                                    icon={colorScheme === "dark" ? "weather-night" : "white-balance-sunny"}
                                    label={t("topbar.theme")}
                                    iconColor={iconColor}
                                    onPress={onToggleTheme}
                                    grow
                                    scale={scale}
                                />
                                <CompactActionButton
                                    icon="file-chart-outline"
                                    label={t("topbar.report")}
                                    iconColor={iconColor}
                                    onPress={onShowReport}
                                    grow
                                    scale={scale}
                                />
                            </View>
                        </View>

                        <View style={{ gap: 6 }}>
                            <Pressable
                                onPress={() => {
                                    setIsLanguageOpen((current) => !current);
                                }}
                                className="flex-row items-center justify-between px-3 py-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                                accessibilityRole="button"
                                accessibilityLabel={t("topbar.language")}
                            >
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="translate" size={sc(17)} color={iconColor} />
                                    <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>
                                        {t("topbar.language")} - {t(`languages.${language}`)}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons name={isLanguageOpen ? "chevron-up" : "chevron-down"} size={sc(20)} color={iconColor} />
                            </Pressable>

                            {isLanguageOpen ? (
                                <View style={{ gap: 6 }}>
                                    {SUPPORTED_LANGUAGES.map((code) => {
                                        const isSelected = code === language;

                                        return (
                                            <Pressable
                                                key={code}
                                                onPress={() => {
                                                    onSelectLanguage(code);
                                                    setIsLanguageOpen(false);
                                                }}
                                                className={`flex-row items-center justify-between px-3 py-2 rounded-full border ${isSelected
                                                    ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100"
                                                    : "border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                                                    }`}
                                                accessibilityRole="button"
                                                accessibilityLabel={t("topbar.selectLanguage", { language: t(`languages.${code}`) })}
                                            >
                                                <Text className={`text-sm font-extrabold ${isSelected ? "text-stone-100 dark:text-stone-900" : "text-stone-900 dark:text-stone-100"}`} style={{ fontSize: sc(14) }}>
                                                    {t(`languages.${code}`)}
                                                </Text>
                                                {isSelected ? (
                                                    <MaterialCommunityIcons
                                                        name="check"
                                                        size={sc(18)}
                                                        color={isSelected ? (colorScheme === "dark" ? "#111827" : "#f8fafc") : iconColor}
                                                    />
                                                ) : null}
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            ) : null}
                        </View>

                        <View style={{ gap: 6 }}>
                            <Pressable
                                onPress={onToggleNotifications}
                                className="flex-row items-center justify-between px-3 py-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                                accessibilityRole="button"
                                accessibilityLabel={t("notifications.enable")}
                            >
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name={notificationsEnabled ? "bell" : "bell-off-outline"} size={sc(17)} color={iconColor} />
                                    <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>{t("notifications.menuLabel")}</Text>
                                </View>
                                <Text className="text-xs font-black uppercase text-stone-500 dark:text-stone-400" style={{ fontSize: sc(12) }}>
                                    {notificationsEnabled ? t("form.save") : "Off"}
                                </Text>
                            </Pressable>

                            {notificationsEnabled ? (
                                <View className="px-3 py-2 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800" style={{ gap: 8 }}>
                                    <View style={styles.timeRow}>
                                        <TimeAdjustControl
                                            value={notificationHour}
                                            onIncrease={() => {
                                                onAdjustNotificationHour(1);
                                            }}
                                            onDecrease={() => {
                                                onAdjustNotificationHour(-1);
                                            }}
                                            iconColor={iconColor}
                                            scale={scale}
                                        />
                                        <Text className="text-xl font-black text-stone-900 dark:text-stone-100" style={{ fontSize: sc(20) }}>:</Text>
                                        <TimeAdjustControl
                                            value={notificationMinute}
                                            onIncrease={() => {
                                                onAdjustNotificationMinute(1);
                                            }}
                                            onDecrease={() => {
                                                onAdjustNotificationMinute(-1);
                                            }}
                                            iconColor={iconColor}
                                            scale={scale}
                                        />
                                    </View>
                                    <Pressable
                                        onPress={onSaveNotifications}
                                        className="px-3 py-2 rounded-full bg-stone-900 dark:bg-stone-100"
                                        accessibilityRole="button"
                                        accessibilityLabel={t("notifications.save")}
                                    >
                                        <Text className="text-xs font-extrabold tracking-wide text-center uppercase text-stone-100 dark:text-stone-900" style={{ fontSize: sc(12) }}>
                                            {t("notifications.save")}
                                        </Text>
                                    </Pressable>
                                </View>
                            ) : null}
                        </View>

                        <View style={{ gap: 6, marginTop: 2 }}>
                            <Text style={[styles.sectionTitle, { color: sectionTitleColor, fontSize: sc(10) }]}>{t("feedback.menuLabel")}</Text>
                            <View className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800" style={{ gap: 8 }}>
                                <View style={{ gap: 4 }}>
                                    <Text className="text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>{t("feedback.soundVolume")}</Text>
                                    <Slider
                                        minimumValue={0}
                                        maximumValue={1}
                                        step={0.01}
                                        value={tapSoundVolume}
                                        onValueChange={onTapSoundVolumeChange}
                                        onSlidingComplete={onTapSoundVolumeComplete}
                                        minimumTrackTintColor={colorScheme === "dark" ? "#f5f5f4" : "#1f2937"}
                                        maximumTrackTintColor={colorScheme === "dark" ? "#52525b" : "#d6d3d1"}
                                        thumbTintColor={colorScheme === "dark" ? "#f5f5f4" : "#111827"}
                                        accessibilityLabel={t("feedback.soundVolumeAccessibility")}
                                    />
                                </View>

                                <View style={{ gap: 4 }}>
                                    <Text className="text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>{t("feedback.vibrationStrength")}</Text>
                                    <Slider
                                        minimumValue={0}
                                        maximumValue={1}
                                        step={0.01}
                                        value={vibrationStrength}
                                        onValueChange={onVibrationStrengthChange}
                                        onSlidingComplete={onVibrationStrengthComplete}
                                        minimumTrackTintColor={colorScheme === "dark" ? "#f5f5f4" : "#1f2937"}
                                        maximumTrackTintColor={colorScheme === "dark" ? "#52525b" : "#d6d3d1"}
                                        thumbTintColor={colorScheme === "dark" ? "#f5f5f4" : "#111827"}
                                        accessibilityLabel={t("feedback.vibrationStrengthAccessibility")}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ gap: 6, marginTop: 2 }}>
                            <Text style={[styles.sectionTitle, { color: sectionTitleColor, fontSize: sc(10) }]}>{t("accessibility.sectionLabel")}</Text>
                            <View className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800" style={{ gap: 8 }}>
                                <View style={{ gap: 4 }}>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>{t("accessibility.textSize")}</Text>
                                        <Text className="text-sm font-black text-stone-500 dark:text-stone-400" style={{ fontSize: sc(14) }}>{UI_SCALE_LABELS[uiScaleIndex]}</Text>
                                    </View>
                                    <Slider
                                        minimumValue={0}
                                        maximumValue={UI_SCALE_OPTIONS.length - 1}
                                        step={1}
                                        value={uiScaleIndex}
                                        onSlidingComplete={onUiScaleChange}
                                        minimumTrackTintColor={colorScheme === "dark" ? "#f5f5f4" : "#1f2937"}
                                        maximumTrackTintColor={colorScheme === "dark" ? "#52525b" : "#d6d3d1"}
                                        thumbTintColor={colorScheme === "dark" ? "#f5f5f4" : "#111827"}
                                        accessibilityLabel={t("accessibility.sliderAccessibility")}
                                    />
                                    <View className="flex-row justify-between px-1">
                                        {UI_SCALE_LABELS.map((label) => (
                                            <Text key={label} className="text-xs font-semibold text-stone-400 dark:text-stone-500">{label}</Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={onResetAll}
                        style={[styles.resetFloatingButton, { bottom: Math.max(insets.bottom, 12) }]}
                        className="flex-row items-center border border-red-300 dark:border-red-900/70 bg-red-50 dark:bg-red-950/50"
                        accessibilityRole="button"
                        accessibilityLabel={t("topbar.resetCountersButton")}
                    >
                        <MaterialCommunityIcons name="refresh" size={sc(18)} color={colorScheme === "dark" ? "#fca5a5" : "#b91c1c"} />
                        <Text className="ml-1.5 text-xs font-black tracking-wide uppercase text-red-700 dark:text-red-300" style={{ fontSize: sc(12) }}>
                            {t("topbar.resetCountersButton")}
                        </Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

/**
 * Compact action button for inline menu controls.
 * @param {{ icon: import("@expo/vector-icons/build/createIconSet").IconName, label: string, iconColor: string, onPress: () => void, grow?: boolean }} props
 * @returns {JSX.Element}
 */
function CompactActionButton({ icon, label, iconColor, onPress, grow = false, scale = 1 }) {
    const sc = (n) => Math.round(n * scale);
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-3 py-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
            style={grow ? { flex: 1 } : undefined}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <MaterialCommunityIcons name={icon} size={sc(17)} color={iconColor} />
            <Text numberOfLines={1} className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100" style={{ fontSize: sc(14) }}>{label}</Text>
        </Pressable>
    );
}

/**
 * Hour/minute increment and decrement control.
 * @param {{ value: number, onIncrease: () => void, onDecrease: () => void, iconColor: string }} props
 * @returns {JSX.Element}
 */
function TimeAdjustControl({ value, onIncrease, onDecrease, iconColor, scale = 1 }) {
    const sc = (n) => Math.round(n * scale);
    return (
        <View style={{ alignItems: "center", gap: 6 }}>
            <Pressable
                onPress={onIncrease}
                accessibilityRole="button"
            >
                <MaterialCommunityIcons name="chevron-up" size={sc(20)} color={iconColor} />
            </Pressable>
            <Text className="text-lg font-black text-stone-900 dark:text-stone-100" style={{ minWidth: 42, textAlign: "center", fontSize: sc(18) }}>
                {String(value).padStart(2, "0")}
            </Text>
            <Pressable
                onPress={onDecrease}
                accessibilityRole="button"
            >
                <MaterialCommunityIcons name="chevron-down" size={sc(20)} color={iconColor} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    drawer: {
        flex: 1,
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        paddingHorizontal: 1,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    resetFloatingButton: {
        position: "absolute",
        right: 12,
        height: 36,
        borderRadius: 999,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});
