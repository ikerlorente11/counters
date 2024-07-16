import { View, Text, StyleSheet, Pressable, Modal } from "react-native";

export function Topbar({ setModalVisible }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TopBar</Text>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 40,
    padding: 7,
  },
  addButton: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 50,
  },
});
