import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Add } from "./Icons";

export function Topbar() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TopBar</Text>
      <Link href="/0" asChild>
        <Add />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
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
