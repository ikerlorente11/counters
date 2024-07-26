import { ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width: screenWidth } = Dimensions.get("window");

export function CustomLineChart({ data }) {
  // data = [
  //   { value: 5, label: "26/6/2024", dataPointText: "5" },
  //   { value: 6, label: "27/6/2024", dataPointText: "5" },
  //   { value: 8, label: "28/6/2024", dataPointText: "5" },
  //   { value: 10, label: "29/6/2024", dataPointText: "5" },
  //   { value: 9, label: "30/6/2024", dataPointText: "5" },
  //   { value: 15, label: "31/6/2024", dataPointText: "5" },
  //   { value: 5, label: "26/7/2024", dataPointText: "5" },
  //   { value: 6, label: "27/7/2024", dataPointText: "5" },
  //   { value: 8, label: "28/7/2024", dataPointText: "5" },
  //   { value: 10, label: "29/7/2024", dataPointText: "5" },
  //   { value: 9, label: "30/7/2024", dataPointText: "5" },
  //   { value: 15, label: "31/7/2024", dataPointText: "5" },
  // ];

  const chartWidth = data.length * 52;

  return (
    <ScrollView horizontal className="px-5 mr-8 h-1/5" width={screenWidth}>
      <LineChart
        data={data}
        thickness={4}
        color="grey"
        width={chartWidth > screenWidth ? chartWidth : screenWidth}
        rotateLabel
        isAnimated
        hideYAxisText
        textColor1="black"
        textShiftY={-8}
        textFontSize={13}
        xAxisLabelTextStyle={{ width: 80, marginLeft: -5 }}
      />
    </ScrollView>
  );
}
