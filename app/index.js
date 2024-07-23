import { StyleSheet, View, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Main } from "../components/Main";

export default function Index() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar animated={true} backgroundColor="green" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
