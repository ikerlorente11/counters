import { Modal, StyleSheet, Text, View, Pressable } from "react-native";
export function CustomModal({ modalVisible, setModalVisible, title, content }) {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.modal}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text>{title}</Text>
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.closeBtn}>X</Text>
            </Pressable>
          </View>
          <View style={styles.body}>{content}</View>
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
});
