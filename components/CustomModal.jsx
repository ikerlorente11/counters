import { Modal, Text, View, Pressable } from "react-native";
import { Button } from "./form/Button";
export function CustomModal({ modalVisible, setModalVisible, title, content }) {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View className="items-center justify-center h-full">
        <View className="w-2/3 px-5 py-3 bg-white rounded-md">
          <Text className="mb-5 text-2xl">{title}</Text>
          <View>{content}</View>
          <Button
            text="Cerrar"
            color={"bg-green-500"}
            custom={"w-2/3 mt-5 mx-auto"}
            action={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
