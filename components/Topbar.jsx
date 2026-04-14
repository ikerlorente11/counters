import { View, Text, Pressable, Modal } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import * as Clipboard from "expo-clipboard";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Add, Edit } from './Icons';
import { useCounter } from "../lib/counterContext";
import { SUPPORTED_LANGUAGES, useI18n } from "../lib/i18n";
import { useToast } from "../lib/toastProvider";
import { DEFAULT_LAYOUT_MODE, GRID_LAYOUT_MODE } from "../lib/layoutMode";
import { getArchivedCounters, getCounters, getCountersValues, updateConfig } from "../lib/db/database";
import { buildYearEndGroupedReport, buildYearEndReportText, buildYearSectionText } from "../lib/reporting";
import { useColorScheme } from "nativewind";

/**
 * Global top bar with theme toggle and contextual action button.
 * @returns {JSX.Element}
 */
export function Topbar() {
  const { t, language, setLanguage } = useI18n();
  const toast = useToast();
  const { colorScheme, setColorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#f5f5f4" : "#111827";
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId, layoutMode, setLayoutMode } = useCounter();
  const isHomePath = path === "/";
  const isCounterDetailPath = regex.test(path);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportGroups, setReportGroups] = useState([]);
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
    const counters = [...getCounters(), ...getArchivedCounters()];
    const registry = getCountersValues();
    setReportGroups(buildYearEndGroupedReport(counters, registry));
    setIsReportModalVisible(true);

    setIsMenuOpen(false);
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
        <Text
          numberOfLines={1}
          className="text-3xl font-black tracking-tight text-center text-stone-900 dark:text-stone-100"
        >
          {t("app.title")}
        </Text>
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
          <View className="flex-1" style={{ paddingTop: insets.top + 58, paddingLeft: 16 }}>
            <Pressable
              onPress={() => { }}
              className="w-44 p-2 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
            >
              <Pressable
                onPress={handleShowReport}
                className="flex-row items-center px-3 py-2 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                accessibilityRole="button"
                accessibilityLabel={t("topbar.report")}
              >
                <MaterialCommunityIcons name="file-chart-outline" size={18} color={iconColor} />
                <Text className="ml-2 text-sm font-bold text-stone-900 dark:text-stone-100">{t("topbar.report")}</Text>
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
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={isReportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsReportModalVisible(false);
        }}
      >
        <Pressable
          onPress={() => {
            setIsReportModalVisible(false);
          }}
          className="items-center justify-center flex-1 px-6 bg-black/35"
        >
          <Pressable onPress={() => { }} className="w-full max-w-md p-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <Text className="text-xl font-black text-center text-stone-900 dark:text-stone-100">
              {t("report.title")}
            </Text>
            <Text className="mt-1 mb-3 text-sm text-center text-stone-600 dark:text-stone-300">
              {t("report.subtitle")}
            </Text>

            <View style={{ gap: 8 }}>
              {reportGroups.length > 0 ? reportGroups.map((group) => (
                <View
                  key={group.year}
                  className="px-4 py-3 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-black text-stone-900 dark:text-stone-100">
                      {group.year}
                    </Text>
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

                  <View className="mt-1" style={{ gap: 4 }}>
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
                </View>
              )) : (
                <View className="px-4 py-8 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                  <Text className="text-sm font-semibold text-center text-stone-600 dark:text-stone-300">
                    {t("report.empty")}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-center mt-4" style={{ gap: 10 }}>
              <Pressable
                onPress={() => {
                  void handleCopyReport();
                }}
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
                className="flex-1 px-4 py-3 rounded-full bg-stone-900 dark:bg-stone-100"
                accessibilityRole="button"
                accessibilityLabel={t("report.savePdf")}
              >
                <Text className="text-sm font-extrabold text-center text-stone-100 dark:text-stone-900">
                  {t("report.savePdf")}
                </Text>
              </Pressable>
            </View>
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
