import { Alert, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import {
  getCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
} from "../../app/db/database";
import { buildValidatedCounterPayload } from "../../lib/counterValidation";

import { LineText } from "./LineText";
import { LineColor } from "./LineColor";
import { Button } from "./Button";

/**
 * Counter form used for create and edit flows.
 * @param {{id: number}} props
 * @returns {JSX.Element}
 */
export function Form({ id }) {
  const router = useRouter();

  const [title, setTitle] = useState("Counter");
  const [value, setValue] = useState("0");
  const [color, setColor] = useState("white");
  const [bgColor, setBgColor] = useState("black");

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
    <View className="">
      <View></View>
      <View>
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
          color={"bg-green-700 dark:bg-green-600"}
          action={id === 0 ? add : update}
          accessibilityLabel="Save counter"
        />
        <Button
          text="Delete"
          color={"bg-red-600 dark:bg-red-700"}
          action={remove}
          accessibilityLabel="Delete counter"
        />
      </View>
    </View>
  );
}
