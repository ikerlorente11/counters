import { View, Dimensions, Text, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../lib/i18n";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Renders historical values chart for one counter.
 * @param {{data: Array<{value: number, label: string, dataPointText?: string}>, latestValue?: number, resetSignal?: number}} props
 * @returns {JSX.Element}
 */
export function CustomLineChart({ data, latestValue = 0, resetSignal = 0, animated = true, isLoading = false }) {
  const { t, language } = useI18n();
  const { colorScheme } = useColorScheme();
  const chartColor = colorScheme === "dark" ? "#f5f5f4" : "#111827";
  const mutedColor = colorScheme === "dark" ? "#a8a29e" : "#57534e";
  const lastPointerIndexRef = useRef(0);
  const [isLabelDismissed, setIsLabelDismissed] = useState(false);

  const containerMaxHeight = Math.round(screenHeight * 0.4);
  const chartViewportWidth = screenWidth - 88;
  const chartHeight = Math.max(130, containerMaxHeight - 128);
  const chartBottomSpace = 34;

  // All data-dependent calculations memoized together
  const chartMetrics = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    const len = safeData.length;
    const endSpacing = 8;
    const chartUsableWidth = Math.max(80, chartViewportWidth - 24);
    const baseSpacing = len <= 7 ? 38 : len <= 30 ? 22 : len <= 90 ? 16 : 12;
    const initialSpacing = len === 1
      ? Math.round((chartUsableWidth - endSpacing) / 2)
      : 18;
    const spacing = len > 1 && len <= 14
      ? Math.max(baseSpacing, (chartUsableWidth - initialSpacing - endSpacing) / (len - 1))
      : baseSpacing;
    const baseLabelStep =
      len <= 10 ? 1 :
        len <= 21 ? 3 :
          len <= 45 ? 5 :
            len <= 90 ? 10 :
              len <= 150 ? 14 : 21;
    const minLabelGap = language === "es" ? 58 : 52;
    const labelStep = Math.max(baseLabelStep, Math.max(1, Math.ceil(minLabelGap / Math.max(spacing, 1))));
    const chartData = safeData.map((item, index) => ({
      ...item,
      label: index % labelStep === 0 ? item.label : "",
    }));
    const maxVal = len > 0 ? Math.max(...safeData.map((item) => item.value)) : 0;
    const minVal = len > 0 ? Math.min(...safeData.map((item) => item.value)) : 0;
    const padding = Math.max(1, Math.ceil((maxVal - minVal || maxVal || 1) * 0.18));
    const adjustedMinValue = Math.max(0, minVal - padding);
    const adjustedMaxValue = maxVal + padding;
    const visibleRange = Math.max(1, adjustedMaxValue - adjustedMinValue);
    const dataSignature = len > 0
      ? `${len}-${safeData[0]?.fullLabel || safeData[0]?.label || ""}-${safeData[len - 1]?.fullLabel || safeData[len - 1]?.label || ""}`
      : "empty";

    return {
      safeData, chartData, spacing, initialSpacing, endSpacing,
      maxVal, minVal, visibleRange, adjustedMinValue,
      topValue: maxVal, bottomValue: minVal,
      dataSignature,
    };
  }, [data, language, chartViewportWidth]);

  useEffect(() => {
    setIsLabelDismissed(true);
    lastPointerIndexRef.current = 0;
  }, [chartMetrics.dataSignature]);

  useEffect(() => {
    setIsLabelDismissed(true);
  }, [resetSignal]);

  if (chartMetrics.safeData.length === 0) {
    return (
      <View className="items-center justify-center w-full py-10 mb-4 border rounded-3xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
        <Text className="text-base font-semibold text-stone-800 dark:text-stone-100">
          {t("chart.empty")}
        </Text>
      </View>
    );
  }

  const { safeData, chartData, spacing, initialSpacing, endSpacing, visibleRange, adjustedMinValue, topValue, bottomValue } = chartMetrics;

  return (
    <View
      className="w-full px-4 py-3 mb-4 border rounded-[28px] border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
      style={{ maxHeight: containerMaxHeight, overflow: "hidden" }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className="text-xs font-bold tracking-[2px] uppercase text-stone-500 dark:text-stone-400">
            {t("chart.trend")}
          </Text>
          <Text className="mt-1 text-2xl font-black text-stone-900 dark:text-stone-100">
            {latestValue}
          </Text>
          <Text className="text-xs text-stone-600 dark:text-stone-300">
            {t("chart.currentValue")}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-bold tracking-[2px] uppercase text-stone-500 dark:text-stone-400">
            {t("chart.range")}
          </Text>
          <Text className="mt-1 text-sm font-bold text-stone-900 dark:text-stone-100">
            {bottomValue} to {topValue}
          </Text>
          <Text className="text-xs text-stone-600 dark:text-stone-300">
            {t("chart.records", { count: safeData.length })}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="items-center justify-center" style={{ height: chartHeight + chartBottomSpace }}>
          <ActivityIndicator size="small" color={mutedColor} />
          <Text className="mt-2 text-xs text-stone-500 dark:text-stone-400">{t("chart.loading")}</Text>
        </View>
      ) : (
      <View
        onTouchStart={() => {
          setIsLabelDismissed(false);
        }}
      >
        <LineChart
          key={chartMetrics.dataSignature}
          data={chartData}
          maxValue={visibleRange}
          yAxisOffset={adjustedMinValue}
          rulesColor={colorScheme === "dark" ? "#292524" : "#e7e5e4"}
          rulesType="dashed"
          thickness={3}
          color={chartColor}
          width={chartViewportWidth}
          height={chartHeight}
          isAnimated={animated}
          animationDuration={animated ? 450 : 0}
          noOfSections={4}
          spacing={spacing}
          initialSpacing={initialSpacing}
          endSpacing={endSpacing}
          labelsExtraHeight={chartBottomSpace}
          xAxisLabelsVerticalShift={8}
          xAxisTextNumberOfLines={1}
          xAxisLabelsHeight={20}
          yAxisLabelWidth={34}
          yAxisTextStyle={{ color: mutedColor, fontSize: 12 }}
          xAxisLabelTextStyle={{ width: 44, fontSize: 10, fontWeight: "700", color: mutedColor }}
          yAxisColor={colorScheme === "dark" ? "#44403c" : "#d6d3d1"}
          xAxisColor={colorScheme === "dark" ? "#44403c" : "#d6d3d1"}
          dataPointsColor1={chartColor}
          dataPointsRadius={3}
          dataPointsWidth={6}
          dataPointsHeight={6}
          dataPointsShape="circular"
          showDataPointOnFocus={false}
          showVerticalLines
          verticalLinesColor={colorScheme === "dark" ? "#1c1917" : "#f5f5f4"}
          verticalLinesThickness={1}
          curved
          curvature={0.22}
          startFillColor={chartColor}
          endFillColor={chartColor}
          startOpacity={0.18}
          endOpacity={0.02}
          areaChart
          hideDataPoints
          disableScroll={safeData.length <= 14}
          showScrollIndicator={false}
          persistPointer
          pointerVanishDelay={1000000000}
          resetPointerIndexOnRelease={false}
          activatePointersOnLongPress={false}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: colorScheme === "dark" ? "#57534e" : "#d6d3d1",
            pointerStripWidth: 1,
            strokeDashArray: [4, 4],
            radius: 4,
            pointerColor: chartColor,
            pointerVanishDelay: 1000000000,
            persistPointer: true,
            resetPointerIndexOnRelease: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelWidth: 116,
            pointerLabelHeight: 58,
            shiftPointerLabelY: -8,
            pointerLabelComponent: (items, _secondaryItems, pointerIndex) => {
              if (isLabelDismissed) {
                return null;
              }

              const item = items?.[0];

              if (Number.isInteger(pointerIndex) && pointerIndex >= 0) {
                lastPointerIndexRef.current = pointerIndex;
              }

              const fallbackItem = chartData[lastPointerIndexRef.current] || chartData[chartData.length - 1];
              const resolvedItem = item || fallbackItem;

              if (!resolvedItem) {
                return null;
              }

              const labelValue = resolvedItem.value ?? resolvedItem.dataPointText ?? "-";

              return (
                <View className="items-center justify-center px-3 py-2 border rounded-2xl border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
                  <Text className="text-xs font-bold tracking-wide uppercase text-stone-500 dark:text-stone-400">
                    {resolvedItem.fullLabel || resolvedItem.label}
                  </Text>
                  <Text className="mt-1 text-lg font-black text-stone-900 dark:text-stone-100">
                    {labelValue}
                  </Text>
                </View>
              );
            },
          }}
        />
      </View>
      )}
    </View>
  );
}
