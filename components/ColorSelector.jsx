import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import ColorPicker, {
  HueCircular,
  OpacitySlider,
  LuminanceSlider,
  SaturationSlider,
  Panel1,
} from "reanimated-color-picker";

export function ColorSelector() {
  const [color, setColor] = useState("white");
  const onSelectColor = ({ hex }) => {
    setColor(hex);
    console.log(hex);
  };
  return (
    <ColorPicker
      boundedThumb
      sliderThickness={20}
      onComplete={onSelectColor}
      value={color}
      style={styles.picker}
    >
      <HueCircular containerStyle={styles.hueContainer} thumbShape="hollow">
        <View style={[styles.view, { backgroundColor: color }]}>
          <Panel1 style={styles.panelStyle} />
        </View>
      </HueCircular>
    </ColorPicker>
  );
}

const styles = StyleSheet.create({
  picker: {
    width: "100%",
    gap: 5,
  },
  hueContainer: {
    justifyContent: "center",
  },
  view: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  panelStyle: {
    width: "70%",
    height: "70%",
    alignSelf: "center",
    borderRadius: 16,
  },
});
