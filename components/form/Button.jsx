import { Pressable, Text } from "react-native";

export function Button({
  text,
  textColor = "text-white",
  color,
  custom,
  action,
}) {
  return (
    <Pressable
      onPress={action}
      className={`justify-center w-1/3 h-12 font-bold ${color} ${custom} rounded-md`}
    >
      <Text className={`text-2xl font-bold text-center ${textColor}`}>
        {text}
      </Text>
    </Pressable>
  );
}
