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
      className={`justify-center min-w-36 h-12 px-4 ${color} ${custom} rounded-2xl`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
    >
      <Text className={`text-base font-extrabold tracking-wide text-center uppercase ${textColor}`}>
        {text}
      </Text>
    </Pressable>
  );
}
