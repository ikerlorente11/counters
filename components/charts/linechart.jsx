import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useColorScheme } from "nativewind";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function CustomLineChart({ data }) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme == "dark" ? "white" : "black";

  // data = [
  //   { value: 5, label: "26/06/24", dataPointText: "5" },
  //   { value: 6, label: "27/06/24", dataPointText: "5" },
  //   { value: 8, label: "28/06/24", dataPointText: "5" },
  //   { value: 10, label: "29/06/24", dataPointText: "5" },
  //   { value: 9, label: "30/06/24", dataPointText: "5" },
  //   { value: 15, label: "31/06/24", dataPointText: "5" },
  //   { value: 5, label: "26/07/24", dataPointText: "5" },
  //   { value: 6, label: "27/07/24", dataPointText: "5" },
  //   { value: 8, label: "28/07/24", dataPointText: "5" },
  //   { value: 10, label: "29/07/24", dataPointText: "5" },
  //   { value: 9, label: "30/07/24", dataPointText: "5" },
  //   { value: 15, label: "31/07/24", dataPointText: "5" },
  // ];

  const chartWidth = data.length * 52;
  const maxVal = Math.max(...data.map(item => item.value));
  const minVal = Math.min(...data.map(item => item.value));

  return (
    <View className="py-3 pl-2 pr-5 m-auto mb-5 bg-blue-200 border rounded-lg dark:bg-stone-500 h-1/3">
      <ScrollView horizontal width={screenWidth - 60}>
        <LineChart
          data={data}
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
          xAxisLabelTextStyle={{ width: 60, marginLeft: 2, fontSize: 14, fontWeight: "bold", color: color }}
          yAxisColor={color}
          xAxisColor={color}
          textColor1={color}
          dataPointsColor1="black"
        />
      </ScrollView>
    </View>
    
  );
}
