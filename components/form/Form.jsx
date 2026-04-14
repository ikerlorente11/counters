import { Alert, View, Text, Modal, Pressable, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import {
  getCounters,
  getArchivedCounters,
  insertCounter,
  restoreCounter,
  updateCounter,
  deleteCounter,
} from "../../lib/db/database";
import { useI18n } from "../../lib/i18n";
import { useToast } from "../../lib/toastProvider";
import { buildValidatedCounterPayload } from "../../lib/counterValidation";

import { LineText } from "./LineText";
import { LineColor } from "./LineColor";
import { Button } from "./Button";

/**
 * Returns default counter colors based on current theme.
 * @param {"light" | "dark" | null | undefined} scheme
 * @returns {{color: string, bgColor: string}}
 */
function getDefaultCounterColors(scheme) {
  if (scheme === "dark") {
    return {
      color: "#f8fafc",
      bgColor: "#111827",
    };
  }

  return {
    color: "#111827",
    bgColor: "#e2e8f0",
  };
}

/**
 * Counter form used for create and edit flows.
 * @param {{id: number, initialOpenArchived?: boolean}} props
 * @returns {JSX.Element}
 */
export function Form({ id, initialOpenArchived = false }) {
  const router = useRouter();
  const { t } = useI18n();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const defaultColors = getDefaultCounterColors(colorScheme);

  const [title, setTitle] = useState(t("form.defaultCounterTitle"));
  const [value, setValue] = useState("0");
  const [color, setColor] = useState(defaultColors.color);
  const [bgColor, setBgColor] = useState(defaultColors.bgColor);
  const [isArchivedModalVisible, setIsArchivedModalVisible] = useState(false);
  const [archivedCounters, setArchivedCounters] = useState([]);

  const getValidatedPayload = () => {
    const validationResult = buildValidatedCounterPayload({
      title,
      value,
      color,
      bgColor,
    }, {
      fallbackTitle: t("form.defaultCounterTitle"),
      invalidValueMessage: t("validation.invalidInteger"),
    });

    if (!validationResult.isValid) {
      toast.error(t("alert.validationError"), validationResult.error);
      return null;
    }

    return validationResult.payload;
  };

  useEffect(() => {
    if (id && id !== 0) {
      const counter = getCounters(id);
      if (counter) {
        setTitle(counter.title);
        setValue(counter.value.toString());
        setColor(counter.color);
        setBgColor(counter.bgColor);
      }
    }
  }, [id]);

  useEffect(() => {
    if (id === 0) {
      const nextDefaults = getDefaultCounterColors(colorScheme);
      setColor(nextDefaults.color);
      setBgColor(nextDefaults.bgColor);
    }
  }, [id, colorScheme]);

  useEffect(() => {
    if (id === 0 && initialOpenArchived) {
      openArchivedCounters();
    }
  }, [id, initialOpenArchived]);

  const add = () => {
    const payload = getValidatedPayload();
    if (!payload) {
      return;
    }

    const insertedCounterId = insertCounter(payload);
    if (!insertedCounterId) {
      toast.error(t("alert.saveError"), t("alert.createFailed"));
      return;
    }

    router.replace("/");
  };

  const update = () => {
    const payload = getValidatedPayload();
    if (!payload) {
      return;
    }

    const currentCounter = getCounters(id);
    if (!currentCounter) {
      toast.error(t("alert.updateError"), t("alert.updateNotFound"));
      return;
    }

    const updated = updateCounter({
      id,
      title: payload.title,
      value: payload.value,
      color: payload.color,
      bgColor: payload.bgColor,
      valueUpdate:
        Number.parseInt(currentCounter.value, 10) !== Number.parseInt(payload.value, 10),
    });

    if (!updated) {
      toast.error(t("alert.updateError"), t("alert.updateFailed"));
      return;
    }

    router.replace("/");
  };

  const remove = () => {
    Alert.alert(
      t("alert.deleteConfirmTitle"),
      t("alert.deleteConfirmBody"),
      [
        {
          text: t("form.cancel"),
          style: "cancel",
        },
        {
          text: t("alert.archiveAction"),
          style: "destructive",
          onPress: () => {
            const deleted = deleteCounter({ id });
            if (!deleted) {
              toast.error(t("alert.deleteError"), t("alert.deleteFailed"));
              return;
            }

            router.dismissAll();
            router.replace("/");
          },
        },
      ],
    );
  };

  const openArchivedCounters = () => {
    const archived = getArchivedCounters();
    setArchivedCounters(archived);
    setIsArchivedModalVisible(true);
  };

  const handleRestoreArchivedCounter = (counterId) => {
    const restored = restoreCounter({ id: counterId });

    if (!restored) {
      toast.error(t("alert.restoreError"), t("alert.restoreFailed"));
      return;
    }

    setIsArchivedModalVisible(false);
    router.replace("/");
  };

  return (
    <View className="pt-3">
      <Text className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
        {id === 0 ? t("form.createCounter") : t("form.editCounter")}
      </Text>
      <Text className="mt-1 mb-5 text-base text-stone-600 dark:text-stone-300">
        {t("form.subtitle")}
      </Text>

      <View className="px-4 py-3 border rounded-3xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
        <LineText name={t("form.name")} value={title} state={setTitle} />
        <LineText
          name={t("form.value")}
          value={value.toString()}
          state={setValue}
          keyboardType="numeric"
        />
        <LineColor name={t("form.color")} value={color} state={setColor} />
        <LineColor name={t("form.background")} value={bgColor} state={setBgColor} />
      </View>

      <View className="flex-row justify-center mt-5" style={{ gap: 10 }}>
        {id !== 0 ? (
          <Button
            text={t("form.delete")}
            color={"bg-red-700 dark:bg-red-600"}
            action={remove}
            accessibilityLabel={t("form.deleteCounter")}
          />
        ) : (
          <Button
            text={t("form.recoverArchived")}
            color={"bg-stone-300 dark:bg-stone-700"}
            textColor="text-stone-900 dark:text-stone-100"
            action={openArchivedCounters}
            accessibilityLabel={t("form.recoverArchivedCounter")}
          />
        )}
        <Button
          text={t("form.save")}
          color={"bg-stone-900 dark:bg-stone-200"}
          textColor="text-stone-100 dark:text-stone-900"
          action={id === 0 ? add : update}
          accessibilityLabel={t("form.saveCounter")}
        />
      </View>

      <Modal
        visible={isArchivedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsArchivedModalVisible(false);
        }}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/35">
          <View className="w-full max-w-md p-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <Text className="text-xl font-black text-center text-stone-900 dark:text-stone-100">
              {t("form.archivedListTitle")}
            </Text>
            <Text className="mt-1 mb-3 text-sm text-center text-stone-600 dark:text-stone-300">
              {t("form.archivedListSubtitle")}
            </Text>

            <FlatList
              data={archivedCounters}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 280 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    handleRestoreArchivedCounter(item.id);
                  }}
                  className="px-4 py-3 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                  accessibilityRole="button"
                  accessibilityLabel={`${t("form.recoverArchivedCounter")}: ${item.title}`}
                >
                  <Text className="text-base font-black text-stone-900 dark:text-stone-100">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                    {item.value}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={(
                <View className="py-8">
                  <Text className="text-sm font-semibold text-center text-stone-600 dark:text-stone-300">
                    {t("form.noArchivedCounters")}
                  </Text>
                </View>
              )}
            />

            <Pressable
              onPress={() => {
                setIsArchivedModalVisible(false);
              }}
              className="px-4 py-3 mt-3 border rounded-full border-stone-300 dark:border-stone-700"
              accessibilityRole="button"
              accessibilityLabel={t("form.cancel")}
            >
              <Text className="text-sm font-extrabold text-center text-stone-900 dark:text-stone-100">
                {t("form.cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
