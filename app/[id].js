import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import { CustomModal } from "../components/CustomModal";
import { ColorSelector } from "../components/ColorSelector";

export default function CounterInfo() {
    const {id} = useLocalSearchParams();
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const [bgColorModalVisible, setBgColorModalVisible] = useState(false);
    const [color, setColor] = useState("white");
    const [bgColor, setBgColor] = useState("black");

    return (
        <View>
            <Text>{id == 0 ? "Nuevo contador" : `Contador ${id}`}</Text>
            <View style={styles.line}>
              <Text>Nombre</Text>
              <TextInput
                style={styles.input}
              />
            </View>
            <Pressable onPress={() => {setColorModalVisible(true)}} style={styles.line}>
              <Text>Color</Text>
              <View
                style={[styles.colorInput, { backgroundColor: color }]}
              />
            </Pressable>
            <Pressable onPress={() => {setBgColorModalVisible(true)}} style={styles.line}>
              <Text>Color</Text>
              <View
                style={[styles.colorInput, { backgroundColor: bgColor }]}
              />
            </Pressable>
            <View>
              <CustomModal
                modalVisible={colorModalVisible}
                setModalVisible={setColorModalVisible}
                title={"Select color"}
                content={<ColorSelector setModal={setColorModalVisible} refColor={color} refSetColor={setColor} />}
              />
              <CustomModal
                modalVisible={bgColorModalVisible}
                setModalVisible={setBgColorModalVisible}
                title={"Select color"}
                content={<ColorSelector setModal={setBgColorModalVisible} refColor={bgColor} refSetColor={setBgColor} />}
              />
            </View>
        </View>
    )
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
  }
});