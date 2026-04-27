import { View, Text, Pressable, Modal, ScrollView, useWindowDimensions, InteractionManager, StyleSheet, Animated, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Add, Edit } from './Icons';
import { useCounter } from "../lib/counterContext";
import { SUPPORTED_LANGUAGES, useI18n } from "../lib/i18n";
import { useToast } from "../lib/toastProvider";
import { DEFAULT_LAYOUT_MODE, GRID_LAYOUT_MODE } from "../lib/layoutMode";
import { getArchivedCounters, getConfig, getCounters, getCountersValues, resetAllCounters, updateConfig } from "../lib/db/database";
import { buildYearEndGroupedReport, buildYearEndReportText, buildYearSectionText, toggleExpandedReportYear } from "../lib/reporting";
import { cancelCounterReminder, requestNotificationPermission, scheduleCounterReminder } from "../lib/notifications";
import { useColorScheme } from "nativewind";

/**
 * Global top bar with theme toggle and contextual action button.
 * @returns {JSX.Element}
 */
export function Topbar() {
  const { t, language, setLanguage } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { height: windowHeight } = useWindowDimensions();
  const iconColor = colorScheme === "dark" ? "#f5f5f4" : "#111827";
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId, layoutMode, setLayoutMode, triggerRefresh } = useCounter();
  const isHomePath = path === "/";
  const isCounterDetailPath = regex.test(path);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationHour, setNotificationHour] = useState(9);
  const [notificationMinute, setNotificationMinute] = useState(0);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportGroups, setReportGroups] = useState([]);
  const [expandedReportYears, setExpandedReportYears] = useState([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const reportContentOpacity = useRef(new Animated.Value(0)).current;
  const nextLayoutLabel = layoutMode === GRID_LAYOUT_MODE ? t("topbar.list") : t("topbar.grid");

  let actionIcon = null;
  let actionLabel = t("topbar.openAction");

  if (isHomePath) {
    actionIcon = <Add className="text-stone-900 dark:text-stone-100" size={24} />;
    actionLabel = t("topbar.createCounter");
  } else if (isCounterDetailPath) {
    actionIcon = <Edit className="text-stone-900 dark:text-stone-100" size={24} />;
    actionLabel = t("topbar.editCounter");
  }

  useEffect(() => {
    updateConfig({ field: "theme", value: colorScheme });
  }, [colorScheme]);

  useEffect(() => {
    updateConfig({ field: "language", value: language });
  }, [language]);

  useEffect(() => {
    updateConfig({ field: "layoutMode", value: layoutMode });
  }, [layoutMode]);

  useEffect(() => {
    const enabled = getConfig("notificationsEnabled") === "true";
    const hour = Number.parseInt(getConfig("notificationHour") ?? "9", 10);
    const minute = Number.parseInt(getConfig("notificationMinute") ?? "0", 10);
    setNotificationsEnabled(enabled);
    setNotificationHour(Number.isNaN(hour) ? 9 : hour);
    setNotificationMinute(Number.isNaN(minute) ? 0 : minute);
  }, []);

  useEffect(() => {
    if (isLoadingReport) {
      reportContentOpacity.setValue(0);
      return;
    }

    if (!isReportModalVisible) {
      reportContentOpacity.setValue(0);
      return;
    }

    Animated.timing(reportContentOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isLoadingReport, isReportModalVisible, reportContentOpacity]);

  const handleOpenNotifications = () => {
    setIsNotificationsModalVisible(true);
    setIsMenuOpen(false);
  };

  const handleSaveNotifications = async () => {
    updateConfig({ field: "notificationsEnabled", value: String(notificationsEnabled) });
    updateConfig({ field: "notificationHour", value: String(notificationHour) });
    updateConfig({ field: "notificationMinute", value: String(notificationMinute) });

    if (notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleCounterReminder({ hour: notificationHour, minute: notificationMinute, language });
      } else {
        setNotificationsEnabled(false);
        updateConfig({ field: "notificationsEnabled", value: "false" });
        toast.error(t("notifications.permissionDenied"), t("notifications.permissionDeniedBody"));
      }
    } else {
      await cancelCounterReminder();
    }

    setIsNotificationsModalVisible(false);
  };

  const handleGoHome = () => {
    setIsMenuOpen(false);
    router.replace("/");
  };

  const handleToggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
    setIsMenuOpen(false);
  };

  const handleChangeLanguage = () => {
    setIsLanguageModalVisible(true);
    setIsMenuOpen(false);
  };

  const handleToggleLayout = () => {
    const nextLayoutMode = layoutMode === GRID_LAYOUT_MODE ? DEFAULT_LAYOUT_MODE : GRID_LAYOUT_MODE;
    setLayoutMode(nextLayoutMode);
    setIsMenuOpen(false);
  };

  const handleSelectLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageModalVisible(false);
  };

  const handleShowReport = () => {
    setIsLoadingReport(true);
    setReportGroups([]);
    setExpandedReportYears([]);
    setIsReportModalVisible(true);
    setIsMenuOpen(false);

    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        const counters = [...getCounters(), ...getArchivedCounters()];
        const registry = getCountersValues();
        setReportGroups(buildYearEndGroupedReport(counters, registry));
        setIsLoadingReport(false);
      });
    });
  };

  const handleResetAll = () => {
    setIsMenuOpen(false);
    Alert.alert(
      t("alert.resetAllConfirmTitle"),
      t("alert.resetAllConfirmBody"),
      [
        {
          text: t("form.cancel"),
          style: "cancel",
        },
        {
          text: t("alert.resetAction"),
          style: "destructive",
          onPress: () => {
            const wasReset = resetAllCounters();
            if (!wasReset) {
              toast.error(t("alert.resetError"), t("alert.resetAllFailed"));
              return;
            }
            triggerRefresh();
          },
        },
      ],
    );
  };

  const closeReportModal = () => {
    setIsReportModalVisible(false);
    setExpandedReportYears([]);
    setIsLoadingReport(false);
  };

  const handleToggleReportYear = (year) => {
    setExpandedReportYears((current) => toggleExpandedReportYear(current, year));
  };

  const handleCopyReport = async () => {
    const reportText = buildYearEndReportText(reportGroups, t);
    await Clipboard.setStringAsync(reportText);
    toast.success(t("report.copySuccessTitle"), t("report.copySuccessBody"));
  };

  const handleCopyReportYear = async (yearGroup) => {
    const reportText = buildYearSectionText(yearGroup, t);
    await Clipboard.setStringAsync(reportText);
    toast.success(t("report.copySuccessTitle"), t("report.copyYearSuccessBody", { year: yearGroup.year }));
  };

  const handleSaveReportPdf = async () => {
    const reportHtml = buildReportHtml(reportGroups, t, colorScheme);
    const { uri } = await Print.printToFileAsync({ html: reportHtml });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: t("report.savePdf"),
      });
      return;
    }

    toast.info(t("report.pdfReadyTitle"), uri);
  };

  return (
    <View
      className="flex-row items-center justify-between px-4 pb-4 border-b bg-stone-100 dark:bg-stone-950 border-stone-200 dark:border-stone-800"
      style={{ paddingTop: insets.top + 10, minHeight: insets.top + 72 }}
    >
      <View className="items-start justify-center w-11 h-11">
        <Pressable
          onPress={() => {
            setIsMenuOpen((current) => !current);
          }}
          className="items-center justify-center w-11 h-11 rounded-2xl bg-stone-200 dark:bg-stone-800"
          accessibilityRole="button"
          accessibilityLabel={t("topbar.openMenu")}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={22}
            color={iconColor}
          />
        </Pressable>

      </View>

      <View className="flex-1 items-center justify-center px-2">
        <Link href="/" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={t("topbar.home")}>
            <Text
              numberOfLines={1}
              className="text-3xl font-black tracking-tight text-center text-stone-900 dark:text-stone-100"
            >
              {t("app.title")}
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="items-end justify-center w-11 h-11">
        {actionIcon ? (
          <Link href={`/counter/edit/${counterId || 0}`} asChild>
            <Pressable
              className="items-center justify-center w-11 h-11 rounded-2xl bg-stone-200 dark:bg-stone-800"
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
            >
              {actionIcon}
            </Pressable>
          </Link>
        ) : null}
      </View>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsMenuOpen(false);
        }}
      >
        <Pressable
          onPress={() => {
            setIsMenuOpen(false);
          }}
          className="flex-1"
        >
          <View className="flex-1" style={{ paddingTop: insets.top + 25, paddingLeft: 16 }}>
            <Pressable
              onPress={() => { }}
              className="w-44 p-2 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
            >
              <Pressable
                onPress={handleGoHome}
                className="flex-row items-center px-3 py-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.home")}
              >
                <MaterialCommunityIcons name="home-outline" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.home")}</Text>
              </Pressable>

              <Pressable
                onPress={handleToggleLayout}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={nextLayoutLabel}
              >
                <MaterialCommunityIcons
                  name={layoutMode === GRID_LAYOUT_MODE ? "view-agenda-outline" : "view-grid-outline"}
                  size={18}
                  color={iconColor}
                />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{nextLayoutLabel}</Text>
              </Pressable>

              <Pressable
                onPress={handleToggleTheme}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.toggleTheme")}
              >
                <MaterialCommunityIcons name="theme-light-dark" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.theme")}</Text>
              </Pressable>

              <Pressable
                onPress={handleOpenNotifications}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("notifications.menuLabel")}
              >
                <MaterialCommunityIcons name={notificationsEnabled ? "bell" : "bell-outline"} size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("notifications.menuLabel")}</Text>
              </Pressable>

              <Pressable
                onPress={handleChangeLanguage}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.language")}
              >
                <MaterialCommunityIcons name="translate" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.language")}</Text>
              </Pressable>

              <Pressable
                onPress={handleShowReport}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.report")}
              >
                <MaterialCommunityIcons name="file-chart-outline" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.report")}</Text>
              </Pressable>

              <Pressable
                onPress={handleResetAll}
                className="flex-row items-center px-3 py-2 mt-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.resetAll")}
              >
                <MaterialCommunityIcons name="refresh" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.resetAll")}</Text>
              </Pressable>

            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={isReportModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => {
          closeReportModal();
        }}
      >
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            onPress={closeReportModal}
            style={styles.reportBackdrop}
            accessibilityRole="button"
            accessibilityLabel={t("form.close")}
          />
          <View
            className="w-full max-w-md p-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
            style={{ maxHeight: Math.min(windowHeight * 0.84, 720) }}
          >
            <Text className="text-xl font-black text-center text-stone-900 dark:text-stone-100">
              {t("report.title")}
            </Text>
            <Text className="mt-1 mb-3 text-sm text-center text-stone-600 dark:text-stone-300">
              {t("report.subtitle")}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              bounces={false}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: Math.min(windowHeight * 0.5, 420) }}
              contentContainerStyle={{ paddingBottom: 4, gap: 8 }}
            >
              {isLoadingReport ? (
                <View style={{ gap: 8 }}>
                  <Text className="text-sm font-semibold text-center text-stone-600 dark:text-stone-300">
                    {t("report.loading")}
                  </Text>
                  <View
                    className="px-4 py-3 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 pr-2" style={{ gap: 8 }}>
                        <View style={styles.reportSkeletonHeading} />
                        <View style={styles.reportSkeletonMeta} />
                      </View>
                      <View className="flex-row items-center" style={{ gap: 10 }}>
                        <View style={styles.reportSkeletonChevron} />
                        <View style={styles.reportSkeletonIcon} />
                      </View>
                    </View>
                  </View>
                </View>
              ) : reportGroups.length > 0 ? (
                <Animated.View style={{ opacity: reportContentOpacity, gap: 8 }}>
                  {reportGroups.map((group) => {
                    const isExpanded = expandedReportYears.includes(group.year);

                    return (
                      <View
                        key={group.year}
                        className="px-4 py-3 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                      >
                        <View className="flex-row items-center justify-between" style={{ gap: 10 }}>
                          <Pressable
                            onPress={() => {
                              handleToggleReportYear(group.year);
                            }}
                            className="flex-1 flex-row items-center justify-between"
                            accessibilityRole="button"
                            accessibilityLabel={isExpanded ? t("report.collapseYear", { year: group.year }) : t("report.expandYear", { year: group.year })}
                          >
                            <View className="flex-1 pr-2">
                              <Text className="text-sm font-black text-stone-900 dark:text-stone-100">
                                {group.year}
                              </Text>
                              <Text className="mt-0.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
                                {t("report.itemCount", { count: group.items.length })}
                              </Text>
                            </View>
                            <MaterialCommunityIcons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={20}
                              color={iconColor}
                            />
                          </Pressable>

                          <Pressable
                            onPress={() => {
                              void handleCopyReportYear(group);
                            }}
                            className="items-center justify-center w-8 h-8 border rounded-lg border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                            accessibilityRole="button"
                            accessibilityLabel={t("report.copyYear", { year: group.year })}
                          >
                            <MaterialCommunityIcons name="content-copy" size={15} color={iconColor} />
                          </Pressable>
                        </View>

                        {isExpanded ? (
                          <View className="mt-3" style={{ gap: 4 }}>
                            {group.items.map((item) => (
                              <View
                                key={`${group.year}-${item.counterId}`}
                                className="flex-row items-center justify-between px-3 py-2 border rounded-xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                              >
                                <Text numberOfLines={1} className="flex-1 pr-2 text-sm font-semibold text-stone-700 dark:text-stone-200">
                                  {item.counterTitle}
                                </Text>
                                <Text className="text-sm font-black text-stone-900 dark:text-stone-100">
                                  {t("report.itemValue", { value: item.value })}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </Animated.View>
              ) : (
                <Animated.View style={{ opacity: reportContentOpacity }}>
                  <View className="px-4 py-8 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                    <Text className="text-sm font-semibold text-center text-stone-600 dark:text-stone-300">
                      {t("report.empty")}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </ScrollView>

            <View className="flex-row justify-center mt-4" style={{ gap: 10 }}>
              <Pressable
                onPress={() => {
                  void handleCopyReport();
                }}
                disabled={isLoadingReport || reportGroups.length === 0}
                className="flex-1 px-4 py-3 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("report.copyAll")}
              >
                <Text className="text-sm font-extrabold text-center text-stone-900 dark:text-stone-100">
                  {t("report.copyAll")}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  void handleSaveReportPdf();
                }}
                disabled={isLoadingReport || reportGroups.length === 0}
                className="flex-1 px-4 py-3 rounded-full bg-stone-900 dark:bg-stone-100"
                accessibilityRole="button"
                accessibilityLabel={t("report.savePdf")}
              >
                <Text className="text-sm font-extrabold text-center text-stone-100 dark:text-stone-900">
                  {t("report.savePdf")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isNotificationsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsNotificationsModalVisible(false);
        }}
      >
        <Pressable
          onPress={() => {
            setIsNotificationsModalVisible(false);
          }}
          className="items-center justify-center flex-1 px-6 bg-black/35"
        >
          <Pressable onPress={() => { }} className="w-full max-w-xs p-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <Text className="text-xl font-black text-center text-stone-900 dark:text-stone-100">
              {t("notifications.modalTitle")}
            </Text>
            <Text className="mt-1 mb-4 text-sm text-center text-stone-600 dark:text-stone-300">
              {t("notifications.modalBody")}
            </Text>

            <Pressable
              onPress={() => setNotificationsEnabled((v) => !v)}
              className="flex-row items-center justify-between px-4 py-3 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
              accessibilityRole="switch"
              accessibilityLabel={t("notifications.enable")}
            >
              <Text className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {t("notifications.enable")}
              </Text>
              <View
                style={[
                  styles.toggleTrack,
                  { backgroundColor: notificationsEnabled ? (colorScheme === "dark" ? "#f5f5f4" : "#1c1917") : "rgba(120,113,108,0.3)" },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      alignSelf: notificationsEnabled ? "flex-end" : "flex-start",
                      backgroundColor: notificationsEnabled ? (colorScheme === "dark" ? "#1c1917" : "#f8fafc") : "#f8fafc",
                    },
                  ]}
                />
              </View>
            </Pressable>

            {notificationsEnabled ? (
              <View className="mt-3 px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                <Text className="text-xs font-bold text-center text-stone-500 dark:text-stone-400" style={{ marginBottom: 12 }}>
                  {t("notifications.time")}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <View style={{ alignItems: "center", gap: 8 }}>
                    <Pressable
                      onPress={() => setNotificationHour((h) => (h + 1) % 24)}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="chevron-up" size={28} color={iconColor} />
                    </Pressable>
                    <Text className="text-2xl font-black text-stone-900 dark:text-stone-100" style={{ minWidth: 48, textAlign: "center" }}>
                      {String(notificationHour).padStart(2, "0")}
                    </Text>
                    <Pressable
                      onPress={() => setNotificationHour((h) => (h - 1 + 24) % 24)}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="chevron-down" size={28} color={iconColor} />
                    </Pressable>
                  </View>
                  <Text className="text-2xl font-black text-stone-900 dark:text-stone-100">:</Text>
                  <View style={{ alignItems: "center", gap: 8 }}>
                    <Pressable
                      onPress={() => setNotificationMinute((m) => (m + 1) % 60)}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="chevron-up" size={28} color={iconColor} />
                    </Pressable>
                    <Text className="text-2xl font-black text-stone-900 dark:text-stone-100" style={{ minWidth: 48, textAlign: "center" }}>
                      {String(notificationMinute).padStart(2, "0")}
                    </Text>
                    <Pressable
                      onPress={() => setNotificationMinute((m) => (m - 1 + 60) % 60)}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="chevron-down" size={28} color={iconColor} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : null}

            <Pressable
              onPress={() => {
                void handleSaveNotifications();
              }}
              className="px-4 py-3 mt-3 rounded-full bg-stone-900 dark:bg-stone-100"
              accessibilityRole="button"
              accessibilityLabel={t("notifications.save")}
            >
              <Text className="text-sm font-extrabold text-center text-stone-100 dark:text-stone-900">
                {t("notifications.save")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsNotificationsModalVisible(false);
              }}
              className="px-4 py-3 mt-2 rounded-full border border-stone-300 dark:border-stone-700"
              accessibilityRole="button"
              accessibilityLabel={t("form.cancel")}
            >
              <Text className="text-sm font-extrabold text-center text-stone-900 dark:text-stone-100">
                {t("form.cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsLanguageModalVisible(false);
        }}
      >
        <Pressable
          onPress={() => {
            setIsLanguageModalVisible(false);
          }}
          className="items-center justify-center flex-1 px-6 bg-black/35"
        >
          <Pressable onPress={() => { }} className="w-full max-w-xs p-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <Text className="text-xl font-black text-center text-stone-900 dark:text-stone-100">
              {t("topbar.languageMenuTitle")}
            </Text>
            <Text className="mt-1 mb-3 text-sm text-center text-stone-600 dark:text-stone-300">
              {t("topbar.languageMenuBody")}
            </Text>

            <View style={{ gap: 8 }}>
              {SUPPORTED_LANGUAGES.map((code) => {
                const isSelectedLanguage = code === language;

                return (
                  <Pressable
                    key={code}
                    onPress={() => {
                      handleSelectLanguage(code);
                    }}
                    className={`flex-row items-center justify-between px-4 py-3 rounded-full border ${isSelectedLanguage
                      ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100"
                      : "border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                      }`}
                    accessibilityRole="button"
                    accessibilityLabel={t("topbar.selectLanguage", { language: t(`languages.${code}`) })}
                  >
                    <Text className={`text-sm font-extrabold ${isSelectedLanguage ? "text-stone-100 dark:text-stone-900" : "text-stone-900 dark:text-stone-100"}`}>
                      {t(`languages.${code}`)}
                    </Text>
                    {isSelectedLanguage ? (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={isSelectedLanguage ? (colorScheme === "dark" ? "#111827" : "#f8fafc") : iconColor}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => {
                setIsLanguageModalVisible(false);
              }}
              className="px-4 py-3 mt-3 rounded-full border border-stone-300 dark:border-stone-700"
              accessibilityRole="button"
              accessibilityLabel={t("form.cancel")}
            >
              <Text className="text-sm font-extrabold text-center text-stone-900 dark:text-stone-100">
                {t("form.cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  reportBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  reportSkeletonHeading: {
    width: 88,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(120, 113, 108, 0.28)",
  },
  reportSkeletonIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(120, 113, 108, 0.18)",
  },
  reportSkeletonMeta: {
    width: 72,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(120, 113, 108, 0.16)",
  },
  reportSkeletonChevron: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(120, 113, 108, 0.14)",
  },
});

function buildReportHtml(reportGroups, t, colorScheme) {
  const bodyRows = reportGroups.length > 0
    ? reportGroups.map((group) => `
        <tr>
          <td colspan="4" style="padding: 12px 0 6px; font-weight: 800;">${group.year}</td>
        </tr>
        ${group.items.map((item) => `
          <tr>
            <td></td>
            <td>${item.counterTitle}</td>
            <td>${item.value}</td>
            <td>${item.recordedAt}</td>
          </tr>
        `).join("")}
      `).join("")
    : `<tr><td colspan="4">${t("report.empty")}</td></tr>`;
  const backgroundColor = colorScheme === "dark" ? "#111827" : "#f8fafc";
  const cardColor = colorScheme === "dark" ? "#1f2937" : "#ffffff";
  const textColor = colorScheme === "dark" ? "#f8fafc" : "#111827";
  const borderColor = colorScheme === "dark" ? "#374151" : "#d6d3d1";

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background: ${backgroundColor}; color: ${textColor}; padding: 24px;">
        <div style="background: ${cardColor}; border: 1px solid ${borderColor}; border-radius: 20px; padding: 24px;">
          <h1 style="margin: 0 0 8px;">${t("report.title")}</h1>
          <p style="margin: 0 0 16px; color: ${textColor};">${t("report.subtitle")}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; border-bottom: 1px solid ${borderColor}; padding: 8px 0;">${t("report.year")}</th>
                <th style="text-align: left; border-bottom: 1px solid ${borderColor}; padding: 8px 0;">${t("report.counter")}</th>
                <th style="text-align: left; border-bottom: 1px solid ${borderColor}; padding: 8px 0;">${t("report.value")}</th>
                <th style="text-align: left; border-bottom: 1px solid ${borderColor}; padding: 8px 0;">${t("report.date")}</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
