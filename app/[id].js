import { Text, View, TextInput, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { CustomModal } from "../components/CustomModal";
import { ColorSelector } from "../components/ColorSelector";
import { useRouter } from "expo-router";

import {
  getCounters,
  insertCounter,
  updateCounter,
  deleteCounter,
} from "../app/database";

export default function CounterInfo() {
  const router = useRouter();

  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);

  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [bgColorModalVisible, setBgColorModalVisible] = useState(false);

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
    router.push("/");
  };

  const update = () => {
    updateCounter({
      id: id,
      title: title,
      value: value,
      color: color,
      bgColor: bgColor,
    });
    router.push("/");
  };

  const remove = () => {
    deleteCounter({ id: id });
    router.push("/");
  };

  return (
    <View>
      <View style={styles.line}>
        <Text>Nombre</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      </View>
      <View style={styles.line}>
        <Text>Valor</Text>
        <TextInput
          style={styles.input}
          value={value.toString()}
          onChangeText={setValue}
        />
      </View>
      <Pressable
        onPress={() => {
          setColorModalVisible(true);
        }}
        style={styles.line}
      >
        <Text>Color</Text>
        <View style={[styles.colorInput, { backgroundColor: color }]} />
      </Pressable>
      <Pressable
        onPress={() => {
          setBgColorModalVisible(true);
        }}
        style={styles.line}
      >
        <Text>Color</Text>
        <View style={[styles.colorInput, { backgroundColor: bgColor }]} />
      </Pressable>
      <View>
        <CustomModal
          modalVisible={colorModalVisible}
          setModalVisible={setColorModalVisible}
          title={"Select color"}
          content={
            <ColorSelector
              setModal={setColorModalVisible}
              refColor={color}
              refSetColor={setColor}
            />
          }
        />
        <CustomModal
          modalVisible={bgColorModalVisible}
          setModalVisible={setBgColorModalVisible}
          title={"Select color"}
          content={
            <ColorSelector
              setModal={setBgColorModalVisible}
              refColor={bgColor}
              refSetColor={setBgColor}
            />
          }
        />
      </View>
      <View className="flex-row justify-center gap-5">
        <Pressable
          onPress={id === 0 ? add : update}
          className="w-1/3 h-12 bg-green-500 font-bold justify-center rounded-md"
        >
          <Text className="text-white text-2xl font-bold text-center">
            {id === 0 ? "Agregar" : "Actualizar"}
          </Text>
        </Pressable>
        <Pressable
          onPress={remove}
          className="w-1/3 h-12 bg-red-500 font-bold justify-center rounded-md"
        >
          <Text className="text-white text-2xl font-bold text-center">
            Borrar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
  },
  input: {
    height: 40,
    margin: 12,
    width: "50%",
    borderWidth: 1,
    padding: 10,
  },
  colorInput: {
    height: 40,
    margin: 12,
    width: "25%",
    borderWidth: 1,
    padding: 10,
  },
  button: {
    width: "50%",
    height: 40,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
