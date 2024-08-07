import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { CustomModal } from "../../components/CustomModal";
import { ColorSelector } from "../../components/ColorSelector";

export function LineColor({ name, value, state }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-row items-center justify-between px-3 py-2">
      <Text className="text-lg text-black capitalize dark:text-stone-50">{name}</Text>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        className="w-1/4 h-10"
      >
        <View
          className="w-full h-full border rounded"
          style={{ backgroundColor: value }}
        />
      </Pressable>

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={"Select color"}
        content={
          <ColorSelector
            setModal={setModalVisible}
            refColor={value}
            refSetColor={state}
          />
        }
      />
    </View>
  );
}
