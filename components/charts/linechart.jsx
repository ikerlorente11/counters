import { View, ScrollView, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useColorScheme } from "nativewind";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Renders historical values chart for one counter.
 * @param {{data: Array<{value: number, label: string, dataPointText?: string}>}} props
 * @returns {JSX.Element}
 */
export function CustomLineChart({ data }) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <View className="items-center justify-center py-3 pl-2 pr-5 m-auto mb-5 bg-blue-200 border rounded-lg dark:bg-stone-500 h-1/3">
        <Text className="text-base font-semibold text-black dark:text-stone-50">
          No values available yet.
        </Text>
      </View>
    );
  }

  const chartWidth = safeData.length * 52;
  const maxVal = Math.max(...safeData.map((item) => item.value));
  const minVal = Math.min(...safeData.map((item) => item.value));

  return (
    <View className="py-3 pl-2 pr-5 m-auto mb-5 bg-blue-200 border rounded-lg dark:bg-stone-500 h-1/3">
      <ScrollView horizontal width={screenWidth - 60}>
        <LineChart
          data={safeData}
          maxValue={maxVal + maxVal * 0.2}
          yAxisOffset={minVal - minVal * 0.2}
          hideRules
          thickness={2}
          color={color}
          width={chartWidth > screenWidth ? chartWidth - 20 : screenWidth - 80}
          height={screenHeight / 3 - 70 * 2}
          rotateLabel
          isAnimated
          hideYAxisText
          textShiftY={-8}
          textFontSize={13}
          xAxisLabelTextStyle={{ width: 60, marginLeft: 2, fontSize: 14, fontWeight: "bold", color }}
          yAxisColor={color}
          xAxisColor={color}
          textColor1={color}
          dataPointsColor1="black"
        />
      </ScrollView>
    </View>
  );
}
