import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { CustomModal } from "../../components/CustomModal";
import { ColorSelector } from "../../components/ColorSelector";
import Color from "color";

/**
 * Returns a safe preview color for UI rendering.
 * @param {string | null | undefined} value
 * @returns {string}
 */
function getSafePreviewColor(value) {
  try {
    return Color(value || "#111827").hex();
  } catch {
    return "#111827";
  }
}

/**
 * Form row for selecting a color with modal picker.
 * @param {{name: string, value: string, state: (value: string) => void}} props
 * @returns {JSX.Element}
 */
export function LineColor({ name, value, state }) {
  const [modalVisible, setModalVisible] = useState(false);
  const safeColor = getSafePreviewColor(value);
  const [draftColor, setDraftColor] = useState(safeColor);

  const handleOpenModal = () => {
    setDraftColor(safeColor);
    setModalVisible(true);
  };

  const handleConfirmColor = () => {
    state(draftColor);
  };

  return (
    <View className="py-2">
      <Text className="mb-2 text-sm font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400">{name}</Text>
      <Pressable
        onPress={handleOpenModal}
        className="w-full h-12"
        accessibilityRole="button"
        accessibilityLabel={`Select ${name.toLowerCase()} color`}
      >
        <View
          className="w-full h-full border rounded-2xl border-stone-300 dark:border-stone-700"
          style={{ backgroundColor: safeColor }}
        />
      </Pressable>

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={"Select color"}
        confirmText="Apply"
        onConfirm={handleConfirmColor}
        content={
          <ColorSelector
            refColor={draftColor}
            refSetColor={setDraftColor}
          />
        }
      />
    </View>
  );
}
