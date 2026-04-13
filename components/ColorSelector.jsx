import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ColorPicker, { HueCircular, Panel1 } from "reanimated-color-picker";
import Color from "color";

const DEFAULT_PICKER_COLOR = "#111827";

/**
 * Ensures the picker always receives a valid hex string.
 * @param {string | null | undefined} value
 * @returns {string}
 */
function toSafeHex(value) {
  try {
    return Color(value || DEFAULT_PICKER_COLOR).hex();
  } catch {
    return DEFAULT_PICKER_COLOR;
  }
}

/**
 * Color picker used inside the color selection modal.
 * @param {{refColor: string, refSetColor: (color: string) => void}} props
 * @returns {JSX.Element}
 */
export function ColorSelector({ refColor, refSetColor }) {
  const [color, setColor] = useState(toSafeHex(refColor));

  const handleColorChange = (selectedColor) => {
    const nextColor = toSafeHex(selectedColor?.hex);
    setColor(nextColor);
    refSetColor(nextColor);
  };

  return (
    <View style={styles.pickerContainer}>
      <ColorPicker
        value={color}
        sliderThickness={20}
        thumbSize={24}
        onChangeJS={handleColorChange}
        onCompleteJS={handleColorChange}
        boundedThumb
      >
        <HueCircular
          containerStyle={[styles.hueContainer, { backgroundColor: color }]}
          thumbShape="pill"
        >
          <Panel1 style={styles.panelStyle} />
        </HueCircular>
      </ColorPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: "100%",
  },
  hueContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  panelStyle: {
    width: "70%",
    height: "70%",
    alignSelf: "center",
    borderRadius: 16,
  },
});
