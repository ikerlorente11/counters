import { View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { CommonActions } from '@react-navigation/native';

import {
  getCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
} from "../../app/db/database";

import { LineText } from "./LineText";
import { LineColor } from "./LineColor";
import { Button } from "./Button";

export function Form({ id }) {
  const router = useRouter();

  const [title, setTitle] = useState("Contador");
  const [value, setValue] = useState("0");
  const [color, setColor] = useState("white");
  const [bgColor, setBgColor] = useState("black");

  useEffect(() => {
    if (id && id !== 0) {
      const counter = getCounters(id);
      if (counter) {
        setTitle(counter.title);
        setValue(counter.value);
        setColor(counter.color);
        setBgColor(counter.bgColor);
      }
    }
  }, []);

  const add = () => {
    insertCounter({
      title: title,
      value: value,
      color: color,
      bgColor: bgColor,
    });
    router.replace("/");;
  };

  const update = () => {
    updateCounter({
      id: id,
      title: title,
      value: value,
      color: color,
      bgColor: bgColor,
      valueUpdate: parseInt(getCounters(id).value) !== parseInt(value),
    });
    router.replace("/");;
  };

  const remove = () => {
    deleteCounter({ id: id });
    router.replace("/");
  };

  return (
    <View className="">
      <View></View>
      <View>
        <LineText name="Nombre" value={title} state={setTitle} />
        <LineText name="Valor" value={value.toString()} state={setValue} />
        <LineColor name="Color" value={color} state={setColor} />
        <LineColor name="Fondo" value={bgColor} state={setBgColor} />
      </View>
      <View className="flex-row justify-center mt-5" style={{ gap: 10 }}>
        <Button
          text="Guardar"
          color={"bg-green-500"}
          action={id === 0 ? add : update}
        />
        <Button text="Borrar" color={"bg-red-500"} action={remove} />
      </View>
    </View>
  );
}
