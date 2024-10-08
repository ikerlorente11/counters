import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Form } from "../../../components/form/Form";

export default function CounterInfo() {
  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);

  return (
    <View className="h-full bg-blue-300 dark:bg-stone-600">
      <Form id={id} />
    </View>
  );
}
