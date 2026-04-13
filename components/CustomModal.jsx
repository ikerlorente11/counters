import { Modal, Text, View } from "react-native";
import { Button } from "./form/Button";

/**
 * Generic modal wrapper used for picker-like interactions.
 * @param {{modalVisible: boolean, setModalVisible: (visible: boolean) => void, title: string, content: JSX.Element, confirmText?: string, onConfirm?: () => void}} props
 * @returns {JSX.Element}
 */
export function CustomModal({
  modalVisible,
  setModalVisible,
  title,
  content,
  confirmText,
  onConfirm,
}) {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View className="items-center justify-center h-full px-4 bg-black/30">
        <View className="w-full max-w-md px-5 py-4 border rounded-3xl border-stone-300 bg-stone-50">
          <Text className="mb-4 text-2xl font-black tracking-tight text-stone-900">{title}</Text>
          <View>{content}</View>
          <View className="flex-row justify-center mt-5" style={{ gap: 10 }}>
            <Button
              text={confirmText || "Close"}
              color={"bg-stone-900"}
              custom={"mx-auto"}
              action={() => {
                onConfirm?.();
                setModalVisible(false);
              }}
            />
            {onConfirm ? (
              <Button
                text="Cancel"
                color={"bg-stone-300"}
                textColor="text-stone-900"
                custom={"mx-auto"}
                action={() => {
                  setModalVisible(false);
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
