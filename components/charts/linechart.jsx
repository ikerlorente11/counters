import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function CustomLineChart({ data }) {
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

  return (
    <View className="py-3 pl-2 pr-5 m-auto mb-5 bg-blue-300 border rounded-lg h-1/3">
      <ScrollView horizontal width={screenWidth - 60}>
        <LineChart
          data={data}
          hideRules
          thickness={4}
          color="grey"
          width={chartWidth > screenWidth ? chartWidth - 20 : screenWidth - 80}
          height={screenHeight / 3 - 65 * 2}
          rotateLabel
          isAnimated
          hideYAxisText
          textColor1="black"
          textShiftY={-8}
          textFontSize={13}
          xAxisLabelTextStyle={{ width: 80, marginLeft: -10, fontSize: 14, fontWeight: "bold" }}
          curved
          curvature={0.1}
        />
      </ScrollView>
    </View>
    
  );
}
