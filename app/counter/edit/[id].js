import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Form } from "../../../components/form/Form";

/**
 * Counter create/edit route wrapper.
 * @returns {JSX.Element}
 */
export default function CounterInfo() {
  const { id: idParam } = useLocalSearchParams();
  const id = parseInt(idParam, 10);

  return (
    <View className="h-full px-4 bg-stone-100 dark:bg-stone-950">
      <Form id={id} />
    </View>
  );
}
