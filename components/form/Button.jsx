import { Pressable, Text } from "react-native";

/**
 * Reusable action button for form actions.
 * @param {{text: string, textColor?: string, color: string, custom?: string, action: () => void, accessibilityLabel?: string}} props
 * @returns {JSX.Element}
 */
export function Button({
  text,
  textColor = "text-white",
  color,
  custom,
  action,
  accessibilityLabel,
}) {
  return (
    <Pressable
      onPress={action}
      className={`justify-center w-1/3 h-12 font-bold ${color} ${custom} rounded-md`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
    >
      <Text className={`text-2xl font-bold text-center ${textColor}`}>
        {text}
      </Text>
    </Pressable>
  );
}
