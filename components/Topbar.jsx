import { View, Text, Pressable, Alert, Modal } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Add, Edit } from './Icons';
import { useCounter } from "../lib/counterContext";
import { SUPPORTED_LANGUAGES, useI18n } from "../lib/i18n";
import { getCounters, getCountersValues, updateConfig } from "../lib/db/database";
import { useColorScheme } from "nativewind";

/**
 * Global top bar with theme toggle and contextual action button.
 * @returns {JSX.Element}
 */
export function Topbar() {
  const { t, language, setLanguage } = useI18n();
  const { colorScheme, setColorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#f5f5f4" : "#111827";
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const regex = /^\/counter\/\d+$/;
  const { counterId } = useCounter();
  const isHomePath = path === "/";
  const isCounterDetailPath = regex.test(path);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

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

  const handleToggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
    setIsMenuOpen(false);
  };

  const handleChangeLanguage = () => {
    setIsLanguageModalVisible(true);
    setIsMenuOpen(false);
  };

  const handleSelectLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setIsLanguageModalVisible(false);
  };

  const handleShowReport = () => {
    const counters = getCounters();
    const registry = getCountersValues();
    const totalCounters = Array.isArray(counters) ? counters.length : 0;
    const totalRecords = Array.isArray(registry) ? registry.length : 0;
    const totalValue = Array.isArray(counters)
      ? counters.reduce((sum, counter) => sum + (Number.parseInt(counter.value, 10) || 0), 0)
      : 0;

    Alert.alert(
      t("topbar.reportTitle"),
      t("topbar.reportBody", {
        counters: totalCounters,
        records: totalRecords,
        total: totalValue,
      }),
    );

    setIsMenuOpen(false);
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
