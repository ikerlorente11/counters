import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { ColorSelector } from "./ColorSelector";
export function NewCounterModal({ modalVisible, setModalVisible, add }) {
  const [counterTitle, setCounterTitle] = useState("");

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modal}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text>New counter</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.closeBtn}>X</Text>
            </Pressable>
          </View>
          <View style={styles.body}>
            <View style={styles.line}>
              <Text style={styles.label}>Titulo</Text>
              <TextInput
                style={styles.input}
                onChangeText={(newText) => setCounterTitle(newText)}
                defaultValue={counterTitle}
              />
            </View>
            <View style={styles.line}>
              <ColorSelector />
            </View>
          </View>
          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                add({ title: counterTitle });
                setCounterTitle("");
                setModalVisible(false);
              }}
            >
              <Text style={styles.saveBtn}>Create</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: "50%",
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  body: {
    gap: 5,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: "20%",
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    width: "80%",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 10,
    borderRadius: 5,
    fontSize: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
});
