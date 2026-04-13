import { Alert, View, Text } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import {
  getCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
} from "../../lib/db/database";
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
 * @param {{id: number}} props
 * @returns {JSX.Element}
 */
export function Form({ id }) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const defaultColors = getDefaultCounterColors(colorScheme);

  const [title, setTitle] = useState("Counter");
  const [value, setValue] = useState("0");
  const [color, setColor] = useState(defaultColors.color);
  const [bgColor, setBgColor] = useState(defaultColors.bgColor);

  const getValidatedPayload = () => {
    const validationResult = buildValidatedCounterPayload({
      title,
      value,
      color,
      bgColor,
    });

    if (!validationResult.isValid) {
      Alert.alert("Validation error", validationResult.error);
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

  const add = () => {
    const payload = getValidatedPayload();
    if (!payload) {
      return;
    }

    const insertedCounterId = insertCounter(payload);
    if (!insertedCounterId) {
      Alert.alert("Save error", "Counter could not be created.");
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
      Alert.alert("Update error", "Counter was not found.");
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
      Alert.alert("Update error", "Counter could not be updated.");
      return;
    }

    router.replace("/");
  };

  const remove = () => {
    const deleted = deleteCounter({ id });
    if (!deleted) {
      Alert.alert("Delete error", "Counter could not be deleted.");
      return;
    }

    router.dismissAll();
    router.replace("/");
  };

  return (
    <View className="pt-3">
      <Text className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
        {id === 0 ? "Create counter" : "Edit counter"}
      </Text>
      <Text className="mt-1 mb-5 text-base text-stone-600 dark:text-stone-300">
        Keep it simple: name, initial value, and colors.
      </Text>

      <View className="px-4 py-3 border rounded-3xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
        <LineText name="Name" value={title} state={setTitle} />
        <LineText
          name="Value"
          value={value.toString()}
          state={setValue}
          keyboardType="numeric"
        />
        <LineColor name="Color" value={color} state={setColor} />
        <LineColor name="Background" value={bgColor} state={setBgColor} />
      </View>

      <View className="flex-row justify-center mt-5" style={{ gap: 10 }}>
        <Button
          text="Save"
          color={"bg-stone-900 dark:bg-stone-200"}
          textColor="text-stone-100 dark:text-stone-900"
          action={id === 0 ? add : update}
          accessibilityLabel="Save counter"
        />
        {id !== 0 ? (
          <Button
            text="Delete"
            color={"bg-red-700 dark:bg-red-600"}
            action={remove}
            accessibilityLabel="Delete counter"
          />
        ) : null}
      </View>
    </View>
  );
}
