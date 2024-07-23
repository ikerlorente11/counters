import { useState } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import ColorPicker, { HueCircular, Panel1 } from "reanimated-color-picker";

export function ColorSelector({ setModal, refColor, refSetColor }) {
  const [color, setColor] = useState(refColor);
  const onSelectColor = ({ hex }) => {
    setColor(hex);
    refSetColor(hex);
  };
  const close = () => {
    setModal(false)
  };

  return (
    <View style={styles.pickerContainer}>
      <ColorPicker
        value={color}
        sliderThickness={20}
        thumbSize={24}
        onComplete={onSelectColor}
        boundedThumb
      >
        <HueCircular
          containerStyle={[styles.hueContainer, { backgroundColor: color }]}
          thumbShape="pill"
        >
          <Panel1 style={styles.panelStyle} />
        </HueCircular>
      </ColorPicker>
      <Pressable>
        <Text onPress={close}>
          Close
        </Text>
      </Pressable>
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
